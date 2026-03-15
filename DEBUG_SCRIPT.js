/**
 * Quick Debug Script - Chạy trong DevTools Console
 * Copy-paste toàn bộ script này vào F12 → Console
 */

// Check if auth token exists
console.group('🔐 Authentication Check')
const token = localStorage.getItem('access_token')
console.log('Access Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')
console.groupEnd()

// Check current user state
console.group('👤 Current User State')
const scriptContent = document.querySelector('script[id="__NEXT_DATA__"]')?.textContent
if (scriptContent) {
    try {
        const data = JSON.parse(scriptContent)
        console.log('Page props:', data)
    } catch (e) {
        console.log('Could not parse page data')
    }
}
console.log('Check React state in Components tab of DevTools')
console.groupEnd()

// Test API endpoints
console.group('🌐 API Endpoint Tests')

async function testEndpoint(endpoint, method = 'GET', body = null) {
    try {
        const token = localStorage.getItem('access_token')
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }

        const response = await fetch(endpoint, {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        })

        const statusColor = response.ok ? '✅' : '❌'
        console.log(`${statusColor} ${method} ${endpoint} → ${response.status}`)

        if (!response.ok) {
            const text = await response.text()
            console.error('Response:', text.substring(0, 200))
        }

        return response.ok
    } catch (error) {
        console.error(`❌ ${method} ${endpoint} → ${error.message}`)
        return false
    }
}

// Test critical endpoints
(async () => {
    console.log('Testing critical endpoints...\n')

    await testEndpoint('/api/profile/me')
    await testEndpoint('/api/chat/conversations')

    console.log('\n✅ Tests complete. Check results above.')
})()

console.groupEnd()

// Clear storage helper
console.group('🧹 Storage Management')
console.log('To clear localStorage:', 'localStorage.clear()')
console.log('To see all tokens:', 'for (let i in localStorage) console.log(i, localStorage[i])')
console.groupEnd()

console.log('\n💡 Tip: Use React DevTools to inspect component state')
