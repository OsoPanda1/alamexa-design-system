// Link principal del header
<NavLink
  to="/catalog"
  layout="inline"
  variant="default"
  size="sm"
  meta={{
    domain: "catalog",
    order: 1,
    groupKey: "main",
    visibilityScope: "public",
    tags: ["top-nav", "discover"],
  }}
>
  Catálogo
</NavLink>

// Tab en dashboard de usuario
<NavLink
  to="/account/trades"
  layout="tab"
  variant="primary"
  size="sm"
  activeClassName="font-bold"
  meta={{
    domain: "trade",
    order: 2,
    groupKey: "account-tabs",
    visibilityScope: "authenticated",
  }}
>
  Mis trueques
</NavLink>

// Link administrativo crítico
<NavLink
  to="/admin/billing"
  layout="pill"
  variant="danger"
  size="sm"
  requiredRole="admin"
  hiddenIfUnauthorized
  leadingIcon={<IconAlertTriangle className="h-4 w-4" />}
  meta={{
    domain: "admin",
    order: 99,
    groupKey: "admin",
    critical: true,
    visibilityScope: "internal",
    tags: ["billing", "sensitive"],
  }}
>
  Billing & riesgos
</NavLink>
