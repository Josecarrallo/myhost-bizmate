

## Plan de Ajustes Visuales

### Resumen
Ajustar las proporciones de las imágenes en las secciones de galería final y "Your Private Sanctuary", además de reducir el tamaño de los boxes de amenities para que todo sea visible en una sola pantalla.

---

### Cambios a Realizar

#### 1. FinalGallery.tsx - Ajustar proporciones de imágenes
- Cambiar de `aspect-[4/3]` a `aspect-[3/4]` o `aspect-square` para que las fotos se vean más verticales/cuadradas y menos estiradas horizontalmente
- Esto mostrará mejor las villas sin distorsión

#### 2. PropertyOverview.tsx - Corregir imagen "Your Private"
- Cambiar de `aspect-[3/2] lg:aspect-[4/3]` a `aspect-[4/5]` o `aspect-square`
- La imagen se verá más proporcionada y menos ancha

#### 3. Amenities.tsx - Reducir tamaño de boxes
- **Reducir padding**: de `p-6 md:p-8` a `p-3 md:p-4`
- **Reducir iconos**: de `w-16 h-16 md:w-20 md:h-20` a `w-10 h-10 md:w-12 md:h-12`
- **Reducir tamaño de iconos internos**: de `w-7 h-7 md:w-9 md:h-9` a `w-5 h-5 md:w-6 md:h-6`
- **Reducir margins del header**: de `mb-12 md:mb-16` a `mb-6 md:mb-8`
- **Reducir padding vertical de la sección**: de `py-16 md:py-20` a `py-8 md:py-12`
- **Reducir gap del grid**: de `gap-6 md:gap-8` a `gap-3 md:gap-4`

---

### Detalles Tecnicos

**Archivos a modificar:**
1. `src/components/villa/FinalGallery.tsx` - Líneas 36 y 57 (aspect ratio)
2. `src/components/villa/PropertyOverview.tsx` - Línea 21 (aspect ratio)
3. `src/components/villa/Amenities.tsx` - Múltiples líneas (padding, tamaños, margins)

**Resultado esperado:**
- Imágenes con proporciones más naturales (menos estiradas)
- Sección de amenities compacta que cabe en una sola pantalla

