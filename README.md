# SuperApp Mini-App Template

Template oficial para desarrollar mini-apps en la plataforma SuperApp.

## Inicio rápido

```bash
# Clonar el template
git clone https://github.com/mauriciocantor/miniapp-template
cd miniapp-template
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build
```

## Usar el SDK

```typescript
import { onSuperAppReady } from 'superapp-jsapi-sdk';

onSuperAppReady((sdk) => {
  // Obtener usuario autenticado
  sdk.getOpenUserInfo({
    success: (user) => console.log(user.name),
  });

  // Cobrar al usuario
  sdk.tradePay({
    amount: 15000,
    currency: 'COP',
    description: 'Mi producto',
    success: (res) => console.log(res.transaction_id),
    fail: (err) => console.log(err.errorMessage),
  });

  // GPS real
  sdk.getLocation({
    success: (loc) => console.log(loc.lat, loc.lng),
  });
});
```

## Publicar tu mini-app

1. Haz `npm run build`
2. Sube el contenido de `dist/` a tu CDN
3. Regístrala en el Admin Panel de SuperApp con la URL del bundle

## Permisos disponibles

| Permiso | Acciones |
|---------|----------|
| `location` | `getLocation` |
| `payments` | `tradePay` |
| `camera` | `chooseImage` |

## Referencia del SDK

Ver documentación completa en [npmjs.com/package/superapp-jsapi-sdk](https://www.npmjs.com/package/superapp-jsapi-sdk)