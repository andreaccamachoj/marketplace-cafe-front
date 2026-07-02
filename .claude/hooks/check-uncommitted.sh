#!/bin/bash
# Hook: Stop — recuerda a Claude hacer commit si hay cambios sin commitear.
# Se ejecuta automáticamente al final de cada respuesta de Claude.

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | grep -q .; then
  printf '{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":"RECORDATORIO DE COMMIT: Hay cambios de codigo sin commitear en el repositorio. Debes hacer commit de TODOS los cambios realizados en este turno usando git con un mensaje descriptivo en formato Conventional Commits (feat/fix/refactor/chore/docs/style). Incluye Co-Authored-By al final del mensaje."}}'
fi
