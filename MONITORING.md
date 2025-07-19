# Server Monitoring Documentation

## Available Monitoring Endpoints

The Student Activity Record Platform provides comprehensive monitoring endpoints for external monitoring services and health checks.

### 1. Simple Ping Endpoint
**URL:** `GET /api/ping`
**Response:** `pong` (text/plain)
**Use Case:** Basic connectivity testing, uptime monitoring services
**Description:** Simplest endpoint for checking if the server is responding

### 2. Basic Status Endpoint
**URL:** `GET /api/status`
**Response:** `Student Activity Record Platform - Server is running` (text/plain)
**Use Case:** Quick status checks with service identification
**Description:** Returns a human-readable status message

### 3. Health Check Endpoint
**URL:** `GET /api/health`
**Response Type:** JSON
**Description:** Detailed health information including database status
```json
{
  "status": "ok",
  "timestamp": "2025-07-19T18:40:52.703Z",
  "uptime": 21.235405615,
  "memory": {
    "rss": 355901440,
    "heapTotal": 229761024,
    "heapUsed": 203412168,
    "external": 32693112,
    "arrayBuffers": 20810686
  },
  "database": true
}
```

### 4. Comprehensive Monitor Endpoint
**URL:** `GET /api/monitor`
**Response Type:** JSON
**Description:** Complete monitoring data optimized for external monitoring services
```json
{
  "service": "Student Activity Record Platform",
  "status": "healthy",
  "health_score": 100,
  "timestamp": "2025-07-19T18:40:52.738Z",
  "uptime_seconds": 21.27067971,
  "uptime_human": "0 minutes",
  "database": {
    "connected": true,
    "type": "MongoDB Atlas"
  },
  "memory": {
    "used_mb": 194,
    "total_mb": 219,
    "usage_percent": 89
  },
  "endpoints": {
    "ping": "/api/ping",
    "health": "/api/health",
    "status": "/api/status",
    "monitor": "/api/monitor"
  }
}
```

## Monitoring Service Integration

### External Monitoring Services
All endpoints support:
- **HTTP GET** requests
- **CORS** enabled for cross-origin requests
- **Security headers** included in responses
- **JSON responses** (except ping and status)

### Suggested Monitoring Setup
1. **Basic Uptime:** Use `/api/ping` for simple up/down monitoring
2. **Health Monitoring:** Use `/api/health` for database connectivity checks
3. **Comprehensive Monitoring:** Use `/api/monitor` for detailed metrics
4. **Load Balancer Health Checks:** Use `/api/status` for quick identification

### Response Status Codes
- **200 OK:** Service is healthy and operational
- **5xx:** Server error (service degraded or down)

### Health Score Calculation
- **100:** All systems operational (database connected, server responsive)
- **0:** Degraded service (database disconnected or server issues)

## Security Features
- Rate limiting applied in production environment
- Security headers (CORS, XSS protection, content type sniffing protection)
- No sensitive information exposed in monitoring responses
- MongoDB connection status only shows boolean (true/false)

## Testing the Endpoints

```bash
# Basic connectivity test
curl http://localhost:5000/api/ping

# Status check
curl http://localhost:5000/api/status

# Health check with JSON response
curl http://localhost:5000/api/health

# Comprehensive monitoring data
curl http://localhost:5000/api/monitor
```

All endpoints are designed to be lightweight and fast-responding for efficient monitoring operations.