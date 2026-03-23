/**
 * API Integration Test Script
 * Chạy trong DevTools Console để kiểm tra các API endpoints
 * 
 * Hướng dẫn:
 * 1. Mở F12 → Console
 * 2. Copy-paste toàn bộ script này
 * 3. Gọi: testAllApis()
 */

const API_BASE = 'http://localhost:3003'
const REAL_API = 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

// Test credentials (thay đổi theo account thực tế)
const TEST_CREDENTIALS = {
  identifier: 'test',
  password: 'test'
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function log(category, message, data = null) {
  const timestamp = new Date().toLocaleTimeString()
  const emoji = {
    'LOGIN': '🔐',
    'GET': '📖',
    'POST': '✍️',
    'ERROR': '❌',
    'SUCCESS': '✅',
    'INFO': 'ℹ️',
    'TEST': '🧪'
  }[category] || '●'
  
  const prefix = `[${timestamp}] ${emoji} [${category}]`
  
  console.log(`%c${prefix} ${message}`, 'color: #0066cc; font-weight: bold;')
  if (data) {
    console.table(data)
  }
}

async function testEndpoint(method, path, body = null, useRealApi = false) {
  const baseUrl = useRealApi ? REAL_API : `${API_BASE}/api`
  const url = `${baseUrl}${path}`
  const token = localStorage.getItem('access_token')

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json().catch(() => ({ text: await response.text() }))

    const statusEmoji = response.ok ? '✅' : '❌'
    log(method, `${statusEmoji} ${response.status} ${method} ${path}`)
    
    return { status: response.status, data, ok: response.ok }
  } catch (error) {
    log('ERROR', `${method} ${path}: ${error.message}`)
    return { status: 0, data: null, ok: false, error: error.message }
  }
}

// ============================================
// TEST SUITES
// ============================================

async function testAuthApi() {
  console.group('%c🔐 AUTH API TESTS', 'color: #ff6600; font-size: 14px; font-weight: bold;')
  
  log('TEST', 'Testing Login endpoint')
  
  // Test local proxy endpoint
  const localResult = await testEndpoint('POST', '/auth/login', TEST_CREDENTIALS)
  if (localResult.ok) {
    log('SUCCESS', 'Local proxy login successful')
    const token = localResult.data?.data?.accessToken || localResult.data?.token
    if (token) {
      localStorage.setItem('access_token', token)
      log('SUCCESS', 'Token saved to localStorage')
    }
  } else {
    log('ERROR', 'Local proxy login failed', localResult.data)
  }
  
  // Test direct real API endpoint
  const realResult = await testEndpoint('POST', '/auth/login', TEST_CREDENTIALS, true)
  if (realResult.ok) {
    log('SUCCESS', 'Real API login successful')
  } else {
    log('ERROR', 'Real API login failed', realResult.data)
  }
  
  console.groupEnd()
}

async function testPostApi() {
  console.group('%c📄 POST API TESTS', 'color: #0099cc; font-size: 14px; font-weight: bold;')
  
  const endpoints = [
    { method: 'GET', path: '/posts/feed?limit=5' },
    { method: 'GET', path: '/posts/my' },
  ]

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.method, endpoint.path)
  }
  
  console.groupEnd()
}

async function testChatApi() {
  console.group('%c💬 CHAT API TESTS', 'color: #00cc66; font-size: 14px; font-weight: bold;')
  
  const endpoints = [
    { method: 'GET', path: '/chat/conversations' },
    { method: 'GET', path: '/chat/unread-count' },
  ]

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.method, endpoint.path)
  }
  
  console.groupEnd()
}

async function testNotificationApi() {
  console.group('%c🔔 NOTIFICATION API TESTS', 'color: #ff9900; font-size: 14px; font-weight: bold;')
  
  const endpoints = [
    { method: 'GET', path: '/notifications' },
    { method: 'GET', path: '/notifications/unread-count' },
  ]

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.method, endpoint.path)
  }
  
  console.groupEnd()
}

async function testProfileApi() {
  console.group('%c👤 PROFILE API TESTS', 'color: #cc00ff; font-size: 14px; font-weight: bold;')
  
  const endpoints = [
    { method: 'GET', path: '/profile/me' },
  ]

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.method, endpoint.path)
  }
  
  console.groupEnd()
}

// ============================================
// MAIN TEST FUNCTION
// ============================================

async function testAllApis() {
  console.clear()
  
  console.log('%c╔════════════════════════════════════╗', 'color: #0066cc; font-weight: bold;')
  console.log('%c║     🧪 THOTOT API TEST SUITE      ║', 'color: #0066cc; font-weight: bold;')
  console.log('%c║  Real API: NGROK + Local Proxy   ║', 'color: #0066cc; font-weight: bold;')
  console.log('%c╚════════════════════════════════════╝', 'color: #0066cc; font-weight: bold;')
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  await testAuthApi()
  await new Promise(resolve => setTimeout(resolve, 500))
  
  await testPostApi()
  await new Promise(resolve => setTimeout(resolve, 500))
  
  await testChatApi()
  await new Promise(resolve => setTimeout(resolve, 500))
  
  await testNotificationApi()
  await new Promise(resolve => setTimeout(resolve, 500))
  
  await testProfileApi()
  
  console.log('%c═══════════════════════════════════════', 'color: #0066cc; font-weight: bold;')
  console.log('%c✅ Test suite completed!', 'color: #00cc00; font-weight: bold;')
  console.log('%c═══════════════════════════════════════', 'color: #0066cc; font-weight: bold;')
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getApiStatus() {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  console.group('📊 API Status')
  console.log('API Domain:', 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1')
  console.log('Token:', token ? `✅ ${token.substring(0, 20)}...` : '❌ Not found')
  console.log('User:', user.id ? `✅ ${user.id}` : '❌ Not found')
  console.log('App URL:', window.location.href)
  console.groupEnd()
}

function clearAllData() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  localStorage.removeItem('refresh_token')
  console.log('✅ Cleared all authentication data')
}

// ============================================
// Export functions for use in console
// ============================================

window.API_TEST = {
  testAllApis,
  getApiStatus,
  clearAllData,
  testEndpoint,
  testAuthApi,
  testPostApi,
  testChatApi,
  testNotificationApi,
  testProfileApi
}

console.log('%c✅ API Test Suite loaded!', 'color: #00cc00; font-weight: bold;')
console.log('%c💡 Usage:', 'color: #0066cc; font-weight: bold;')
console.log('  API_TEST.testAllApis()      - Run all tests')
console.log('  API_TEST.getApiStatus()     - Check current status')
console.log('  API_TEST.clearAllData()     - Clear authentication data')
console.log('  API_TEST.testAuthApi()      - Test auth endpoints only')
