# Docker & despliegue (ALAMEXA)

Este documento explica cómo construir y ejecutar la imagen Docker optimizada para la SPA ALAMEXA, buenas prácticas de seguridad y recomendaciones para CI/Kubernetes.

## Resumen
- Multi-stage build:
  - Builder: Node 20 (Alpine) + pnpm → `pnpm build`
  - Runtime: Nginx (stable‑alpine) sirve `dist/` con cabeceras de seguridad y caching
- Non-root runtime (usuario `nginx`)
- Healthcheck activo
- Archivo de nginx personalizado: `docker/nginx.conf`

---

## Construir la imagen localmente

Desde la raíz del proyecto:

```bash
# Build local (simple)
docker build -t alamexa:local .

# Probar
docker run --rm -p 8080:80 alamexa:local
# Abrir http://localhost:8080
```

Para reproducibilidad y multi‑arquitectura (recomendado para publicar en registries):

```bash
# Usando buildx (multi-platform) y push directo a registry (ej. GHCR)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/<OWNER>/alamexa:latest \
  --push .
```

Sustituye `<OWNER>` por tu organización/usuario y añade `--push` para subir.

---

## Variables y secretos
- NO embedas `.env` o credenciales en la imagen.
- Para variables de build (ej. URL base ejecutadas en time of build), usa build‑args:
  - `--build-arg VITE_APP_URL=https://alamexa.app` y luego referencia `import.meta.env.VITE_APP_URL` durante el build.
- Para runtime, provee secrets/config como variables de entorno en tu orquestador (K8s Secrets, Docker Swarm secrets, etc.) o a través de un reverse proxy.

---

## Escaneo y seguridad de la imagen
- Ejecuta scans de dependencias y de la propia imagen:
  - `pnpm audit` / `npm audit`
  - `docker scan alamexa:local` (integración con Snyk/Trivy dependiendo del entorno)
- Recomendación: rotar y revocar cualquier secreto si detectas fugas; usa `gitleaks` para escanear historia.

---

## Salud y readiness
- El Dockerfile incluye un `HEALTHCHECK` que realiza `curl` a `/`.
- En Kubernetes define `readinessProbe` y `livenessProbe` apuntando a `/` o `/health` (si implementas endpoint).

Ejemplo (fragmento K8s deployment):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alamexa
spec:
  replicas: 3
  selector:
    matchLabels:
      app: alamexa
  template:
    metadata:
      labels:
        app: alamexa
    spec:
      containers:
        - name: alamexa
          image: ghcr.io/<OWNER>/alamexa:latest
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 15
```

---

## CI / GitHub Actions sugerido (resumen)
Crea un workflow que haga:
1. checkout
2. pnpm install --frozen-lockfile
3. pnpm lint
4. pnpm type-check
5. pnpm test -- --coverage
6. pnpm build
7. pnpm audit
8. docker buildx build + push (solo en `main` con tags)
9. image scan (Trivy / Snyk)

---

## Buenas prácticas y notas de seguridad
- Elimina credenciales desde README o archivos visibles (ej.: `Demo Admin` con password real). Usa placeholders o un flow para crear cuentas demo localmente.
- No incluyas `.env` en el repo; usa `.env.example`.
- Activa Dependabot o actualizaciones automáticas para dependencias críticas.
- Añade reglas CSP en nginx adaptadas a los scripts/3rd party que uses (analytics, CDNs).
- Habilita TLS (terminación en proxy o Ingress con cert-manager / Let’s Encrypt) — Nginx aquí sirve HTTP; en producción recomienda TLS en la capa de ingreso.

---

## Optimización del tamaño de la imagen
- Usa `pnpm` y elimina devDependencies en runtime (ya hecho con multi-stage).
- Si tu build genera sourcemaps grandes, exclúyelos del resultado en `dist/` para la imagen de producción.
- Revisa `npm prune --production` si necesitas más reducciones (con cuidado).

---

## Debugging rápido
- Si la aplicación no carga al desplegar:
  1. Revisa logs del contenedor: `docker logs <container>`
  2. Revisa /var/log/nginx/error.log dentro del contenedor
  3. Asegúrate que `pnpm build` produce la carpeta `dist/` con index.html

---



¿Quieres que genere también el workflow de GitHub Actions y un `docker-compose.yml` de ejemplo?
