
# Guía para Desarrolladores - Sistema de Análisis y Métricas

## Visión General

El sistema de análisis y métricas proporciona capacidades completas de seguimiento, análisis y recomendaciones personalizadas para la aplicación de fitness. Está diseñado para ser escalable, mantenible y fácil de usar.

## Arquitectura

### Servicios Core

#### `analyticsService` (`src/services/analytics.ts`)
Servicio principal que maneja todas las operaciones relacionadas con métricas y análisis.

**Funcionalidades principales:**
- Seguimiento de eventos de usuario
- Registro de métricas de progreso
- Generación de datos de dashboard
- Creación de recomendaciones personalizadas

**Métodos clave:**
```typescript
// Seguimiento de eventos
await analyticsService.trackEvent('workout_completed', { duration: 45 });

// Registro de métricas
await analyticsService.recordProgressMetric('weight', 70, 'kg');

// Obtener datos del dashboard
const dashboardData = await analyticsService.getDashboardData();

// Generar recomendaciones
await analyticsService.generateRecommendations();
```

### Hooks Personalizados

#### `useAnalytics` (`src/hooks/useAnalytics.ts`)
Hook React que proporciona una interfaz simple para usar las funcionalidades de análisis.

**Características:**
- Estado de carga automático
- Funciones memoizadas para optimización
- Seguimiento automático de vistas de página
- Actualización automática de datos

**Uso básico:**
```typescript
const {
  dashboardData,
  recommendations,
  trackEvent,
  refreshDashboard
} = useAnalytics();
```

### Componentes UI

#### `AnalyticsDashboard` (`src/components/analytics/AnalyticsDashboard.tsx`)
Componente principal del dashboard que muestra análisis completos.

**Características:**
- Tarjetas de métricas generales
- Gráficos interactivos (líneas, barras, circular)
- Display de recomendaciones
- Controles de actualización

#### `QuickMetrics` (`src/components/analytics/QuickMetrics.tsx`)
Componente compacto para mostrar métricas clave en otras páginas.

## Estructura de Datos

### Tablas de Base de Datos

#### `app_usage_metrics`
Almacena eventos de uso de la aplicación.

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- event_type: TEXT
- event_data: JSONB
- session_id: TEXT
- page_path: TEXT
- created_at: TIMESTAMP
```

#### `user_progress_metrics`
Registra métricas de progreso del usuario.

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- metric_name: TEXT
- metric_value: NUMERIC
- metric_unit: TEXT
- date: DATE
- created_at: TIMESTAMP
```

#### `user_recommendations`
Almacena recomendaciones personalizadas.

```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- recommendation_type: TEXT
- title: TEXT
- description: TEXT
- priority: INTEGER
- is_active: BOOLEAN
- expires_at: TIMESTAMP
- created_at: TIMESTAMP
```

## Patrones de Desarrollo

### Seguimiento de Eventos

Los eventos deben seguir una convención de nomenclatura clara:

```typescript
// Patrón: {categoria}_{accion}
'workout_completed'
'exercise_added'
'page_view'
'milestone_achieved'
```

### Métricas de Progreso

Las métricas deben incluir unidades cuando sea apropiado:

```typescript
await recordProgressMetric('weight', 70, 'kg');
await recordProgressMetric('workout_count', 15); // Sin unidad para conteos
await recordProgressMetric('max_bench_press', 100, 'kg');
```

### Recomendaciones

Las recomendaciones siguen tipos predefinidos:

- `workout_frequency`: Frecuencia de entrenamiento
- `workout_duration`: Duración de sesiones
- `consistency`: Consistencia en entrenamientos
- `exercise_variety`: Variedad de ejercicios

## Mejores Prácticas

### Performance

1. **Memoización**: Usar `useCallback` y `useMemo` para funciones y cálculos costosos
2. **Carga diferida**: Cargar datos solo cuando sea necesario
3. **Índices de BD**: Asegurar índices apropiados en consultas frecuentes

### Mantenibilidad

1. **Documentación JSDoc**: Documentar todas las funciones públicas
2. **Tipos TypeScript**: Usar tipos estrictos para todas las interfaces
3. **Separación de responsabilidades**: Mantener servicios, hooks y componentes separados

### Testing

1. **Unit Tests**: Testear servicios y hooks independientemente
2. **Integration Tests**: Testear flujos completos de usuario
3. **Mocking**: Mockear servicios externos en tests

## Extensión del Sistema

### Añadir Nuevas Métricas

1. Definir el tipo de métrica en `analytics.ts`
2. Implementar lógica de cálculo si es necesario
3. Actualizar componentes UI para mostrar la métrica
4. Añadir tests apropiados

### Nuevos Tipos de Recomendaciones

1. Añadir tipo en la constante de tipos
2. Implementar lógica de generación en `generateRecommendations()`
3. Actualizar UI para mostrar el nuevo tipo
4. Documentar el comportamiento esperado

### Nuevos Dashboards

1. Crear componente especializado
2. Usar `useAnalytics` hook para datos
3. Implementar visualizaciones apropiadas
4. Seguir patrones de diseño existentes

## Troubleshooting

### Problemas Comunes

1. **Datos no actualizados**: Verificar RLS policies en Supabase
2. **Performance lenta**: Revisar índices de base de datos
3. **Memoria alta**: Verificar que los useEffect se limpien apropiadamente

### Debugging

```typescript
// Habilitar logs detallados
console.log('Analytics Debug:', {
  dashboardData,
  recommendations,
  isLoading
});
```

## Roadmap

### Próximas Características

1. **Análisis predictivo**: ML para predecir patrones de entrenamiento
2. **Comparación social**: Comparar métricas con otros usuarios
3. **Exportación de datos**: Permitir exportar datos en diferentes formatos
4. **Notificaciones inteligentes**: Notificaciones basadas en patrones

### Mejoras de Performance

1. **Caching**: Implementar caching de consultas frecuentes
2. **Paginación**: Paginar datos históricos largos
3. **Agregaciones**: Pre-calcular métricas complejas

## Contribución

Para contribuir al sistema de análisis:

1. Seguir los patrones establecidos
2. Añadir documentación apropiada
3. Incluir tests para nuevas funcionalidades
4. Actualizar esta guía según sea necesario

## Contacto

Para preguntas sobre el sistema de análisis, contactar al equipo de desarrollo.
