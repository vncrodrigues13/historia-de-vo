# External Assets Needed: Feature 02 Story Creation Form

Source of truth:
- `spec/features/02-story-creation-form.feature.md`
- `spec/features/09-stitch-screen-implementation.feature.md`

Stitch identifiers:
- Project ID: `15204996058292121576`
- Screen name: `Criar História (Restaurada)`
- Screen ID: `8a422bd8840044ab9b40c7f313011b02`

Required local files:
- `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/screen.png`
- `frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/stitch-code.html`

Required external URLs:
- `CRIAR_HISTORIA_IMAGE_URL`
- `CRIAR_HISTORIA_CODE_URL`

Fetch commands:
```bash
curl -L "$CRIAR_HISTORIA_IMAGE_URL" -o frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/screen.png
curl -L "$CRIAR_HISTORIA_CODE_URL" -o frontend/assets/stitch/8a422bd8840044ab9b40c7f313011b02/stitch-code.html
```

Validation checklist:
- `screen.png` exists and opens.
- `stitch-code.html` exists and opens.
- No temporary URLs, auth tokens, or credentials are committed.
