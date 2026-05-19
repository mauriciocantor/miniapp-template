import { useState, useEffect } from 'react';
import { waitForSuperApp, onSuperAppReady } from 'superapp-jsapi-sdk';
import type { UserInfo, SuperAppSDK } from 'superapp-jsapi-sdk';

export default function App() {
  const [sdk, setSdk] = useState<SuperAppSDK | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)]);

  useEffect(() => {
    const cleanup = onSuperAppReady((sdkInstance) => {
      setSdk(sdkInstance);
      sdkInstance.getOpenUserInfo({
        success: (res) => {
          setUser(res);
          addLog(`✅ Usuario: ${res.name}`);
        },
        fail: (err) => addLog(`❌ Auth error: ${err.errorMessage}`),
      });
    });
    return cleanup;
  }, []);

  function testToast() {
    sdk?.showToast({
      content: '¡Hola desde la mini-app!',
      type: 'success',
      duration: 2000,
      complete: () => addLog('✅ Toast mostrado'),
    });
  }

  function testAlert() {
    sdk?.alert({
      title: 'Título del Alert',
      content: 'Este alert lo dibuja Flutter nativo.',
      buttonText: 'Entendido',
      success: () => addLog('✅ Alert cerrado'),
    });
  }

  function testConfirm() {
    sdk?.confirm({
      title: '¿Confirmar acción?',
      content: 'Esta es una confirmación nativa de Flutter.',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      success: (res) => addLog(res.confirmed ? '✅ Confirmado' : '❌ Cancelado'),
    });
  }

  function testLocation() {
    sdk?.getLocation({
      type: 'wgs84',
      success: (res) => addLog(`📍 ${res.lat.toFixed(4)}, ${res.lng.toFixed(4)}`),
      fail: (err) => addLog(`❌ Location: ${err.errorMessage}`),
    });
  }

  function testStorage() {
    sdk?.setStorage({
      key: 'test_key',
      data: JSON.stringify({ value: Date.now() }),
      success: () => {
        sdk.getStorage({
          key: 'test_key',
          success: (res) => addLog(`💾 Storage: ${res.data}`),
        });
      },
    });
  }

  function testPay() {
    sdk?.tradePay({
      amount: 1000,
      currency: 'COP',
      description: 'Pago de prueba desde template',
      orderId: `test_${Date.now()}`,
      success: (res) => addLog(`💳 Pago: ${res.transaction_id}`),
      fail: (err) => addLog(`❌ Pago: ${err.errorMessage}`),
    });
  }

  function testCamera() {
    sdk?.chooseImage({
      count: 1,
      sourceType: ['camera', 'album'],
      success: (res) => addLog(`📷 Imagen: ${res.name} (${(res.size / 1024).toFixed(1)}KB)`),
      fail: (err) => addLog(`❌ Cámara: ${err.errorMessage}`),
    });
  }

  const btn = (label: string, onClick: () => void, color = '#6C63FF') => (
    <button
      onClick={onClick}
      style={{
        background: color, color: 'white', border: 'none',
        borderRadius: 10, padding: '10px 16px', fontSize: 13,
        fontWeight: 600, width: '100%', marginBottom: 8,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ background: '#6C63FF', padding: '20px 16px' }}>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
          SuperApp Mini-App Template
        </div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 20, marginTop: 4 }}>
          {user ? `Hola, ${user.name.split(' ')[0]} 👋` : 'Conectando...'}
        </div>
        {user && (
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
            {user.email} · {user.role}
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {/* Estado del SDK */}
        <div style={{
          background: sdk ? '#e8f5e9' : '#fff3e0',
          borderRadius: 10, padding: '10px 14px',
          marginBottom: 16, fontSize: 13,
          color: sdk ? '#2e7d32' : '#e65100',
          fontWeight: 500,
        }}>
          {sdk ? '🟢 SDK conectado al host' : '🟡 Esperando conexión con el host...'}
        </div>

        {/* Botones de prueba */}
        <div style={{
          background: 'white', borderRadius: 14,
          padding: 16, marginBottom: 16,
          border: '1px solid #eee',
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Probar JSAPI
          </div>
          {btn('showToast', testToast, '#6C63FF')}
          {btn('alert', testAlert, '#2196F3')}
          {btn('confirm', testConfirm, '#009688')}
          {btn('getLocation', testLocation, '#FF5722')}
          {btn('setStorage + getStorage', testStorage, '#9C27B0')}
          {btn('tradePay — $1.000 COP', testPay, '#4CAF50')}
          {btn('chooseImage', testCamera, '#607D8B')}
        </div>

        {/* Log de eventos */}
        <div style={{
          background: '#1A1A2E', borderRadius: 14,
          padding: 14, border: '1px solid #333',
        }}>
          <div style={{ color: '#9C8FFF', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            CONSOLE LOG
          </div>
          {log.length === 0 ? (
            <div style={{ color: '#555', fontSize: 12 }}>
              Los eventos aparecerán aquí...
            </div>
          ) : (
            log.map((entry, i) => (
              <div key={i} style={{
                color: '#A8A8B3', fontSize: 12,
                fontFamily: 'monospace', marginBottom: 4,
              }}>
                {entry}
              </div>
            ))
          )}
        </div>

        {/* Info para desarrolladores */}
        <div style={{
          marginTop: 16, padding: '12px 14px',
          background: 'white', borderRadius: 14,
          border: '1px solid #eee', fontSize: 12,
          color: '#888',
        }}>
          <div style={{ fontWeight: 600, color: '#333', marginBottom: 6 }}>
            📦 Cómo usar este template
          </div>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 6 }}>
            npm install superapp-jsapi-sdk
          </div>
          <div style={{ marginTop: 8 }}>
            Registra tu mini-app en el Admin Panel con la URL de tu bundle y los permisos que necesitas.
          </div>
        </div>
      </div>
    </div>
  );
}