crx-playwright-ai/
│
├── records-crx/ # Input dari Playwright Recorder
│ ├── <feature>.record.ts # root level features
│ └── <module>/ # feature modules
│     ├── <feature>.record.ts
│     └── <submodule>/
│         └── <feature>.record.ts
│
├── docs/ # AI Rules & Documentation
│ ├── AI_MASTER_PROMPT.md
│ ├── AI_CONTRACT.md
│ ├── AI_EXAMPLE_OUTPUT.md
│ ├── AUTH_AND_COOKIES.md
│ ├── AUTH_COOKIES_FLOW.md
│ └── SELECTOR_IMPROVEMENT_SUGGESTIONS.md
│
├── pages/ # Page Objects (struktur ikut path record)
│ ├── auth/ # Authentication pages
│ │ ├── Login.page.ts
│ │ └── LoginAdminMr.page.ts
│ └── <module>/ # Feature modules
│     ├── <submodule>/ # Sub-features
│     │ └── <Feature>.page.ts
│     └── <Feature>.page.ts
│
├── tests/
│ ├── auth.setup.ts # Global auth setup
│ └── smoke/
│     ├── auth/ # Auth smoke tests
│     │ └── <auth-feature>.spec.ts
│     └── <module>/ # Feature smoke tests
│         ├── <submodule>/
│         │ └── <feature>.spec.ts
│         └── <feature>.spec.ts
│
├── .auth/ # Session storage (gitignored)
├── .env.example # Environment template
├── playwright.config.ts
└── README.md
