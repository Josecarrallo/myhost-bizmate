@echo off
echo.
echo ========================================
echo  MYHOST BizMate - Copy Migration SQL
echo ========================================
echo.
echo Copiando SQL al portapapeles...
echo.

type "MYHOST Bizmate_Documentos_Estrategicos 2025_2026\MIGRATION_001_MULTIVILLA_REPORTS.sql" | clip

echo [OK] SQL copiado al portapapeles!
echo.
echo Ahora:
echo.
echo 1. Abre: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new
echo 2. Pega el SQL (Ctrl+V)
echo 3. Click "Run"
echo 4. Espera el mensaje: "MIGRATION 001 COMPLETED SUCCESSFULLY!"
echo.
echo Presiona cualquier tecla cuando hayas terminado...
pause >nul

echo.
echo Verificando si la migracion fue exitosa...
echo.
echo Abre MYHOST BizMate - AI Systems - OSIRIS
echo Deberias ver un dropdown con tus propiedades en "Business Reports"
echo.
pause
