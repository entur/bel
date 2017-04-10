export default {
  "allowed-origins": [
    "https://test.rutebanken.org",
    "http://localhost:8000",
    "http://localhost:9000"
  ],
  "realm_access": {
    "roles": [
      "editOrganisation",
      "rutebanken",
      "editRouteData",
      "editStops",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "view-profile"
      ]
    }
  },
  "roles": [
    "{\"r\":\"editStops\",\"o\":\"RB\"}",
    "{\"r\":\"editRouteData\",\"o\":\"RUT\"}",
    "{\"r\":\"editOrganisation\",\"o\":\"RB\"}"
  ],
  "name": "Test Testesen",
  "preferred_username": "test",
  "given_name": "Test ",
  "family_name": "Testesen",
  "email": "test@rutebanken.org"
}