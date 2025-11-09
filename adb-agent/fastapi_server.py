"""
FastAPI ADB Automation Server
Provides REST API for Android device automation via ADB
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import subprocess
import json
import os
import re

app = FastAPI(
    title="ADB Automation API",
    description="Android device automation via ADB",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WhatsAppMessage(BaseModel):
    contact: str
    message: str

class AutomationStep(BaseModel):
    action: str
    target: Optional[str] = None
    text: Optional[str] = None
    browser: Optional[str] = None
    reasoning: Optional[str] = None

class AutomationPlan(BaseModel):
    steps: List[AutomationStep]

# Helper function to run ADB commands
def run_adb(command: str) -> dict:
    """Execute ADB command and return result"""
    try:
        result = subprocess.run(
            f"adb {command}",
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Command timed out"
        }
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ADB Automation API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/status")
async def get_status():
    """Check ADB connection status"""
    result = run_adb("devices")
    
    if not result["success"]:
        return {
            "connected": False,
            "message": "ADB not available",
            "error": result["error"]
        }
    
    # Parse device list
    devices = []
    for line in result["output"].split('\n')[1:]:
        if line.strip() and '\t' in line:
            device_id, status = line.split('\t')
            devices.append({"id": device_id.strip(), "status": status.strip()})
    
    return {
        "connected": len(devices) > 0,
        "message": f"Found {len(devices)} device(s)",
        "devices": devices
    }

@app.post("/whatsapp")
async def send_whatsapp(data: WhatsAppMessage):
    """Send WhatsApp message using the working automation method"""
    
    # Get screen dimensions
    screen_result = run_adb('shell wm size')
    screen_match = re.search(r'(\d+)x(\d+)', screen_result["output"])
    screen_width = int(screen_match.group(1)) if screen_match else 720
    screen_height = int(screen_match.group(2)) if screen_match else 1600
    
    # Step 1: Open WhatsApp
    run_adb('shell am start -n com.whatsapp/.Main')
    subprocess.run(['sleep', '2.5'], check=False)
    
    # Step 2: Open search
    run_adb('shell input keyevent 84')  # Search key
    subprocess.run(['sleep', '1'], check=False)
    
    # Step 3: Type contact name
    search_text = data.contact.replace(' ', '%s')
    run_adb(f'shell input text "{search_text}"')
    subprocess.run(['sleep', '1.5'], check=False)
    
    # Step 4: Tap first search result
    result_y = int(screen_height * 0.25)
    result_x = int(screen_width * 0.5)
    run_adb(f'shell input tap {result_x} {result_y}')
    subprocess.run(['sleep', '2'], check=False)
    
    # Step 5: Type message
    message_text = data.message.replace(' ', '%s')
    run_adb(f'shell input text "{message_text}"')
    subprocess.run(['sleep', '1'], check=False)
    
    # Step 6: Find and tap send button
    run_adb('shell uiautomator dump')
    ui_dump = run_adb('shell cat /sdcard/window_dump.xml')
    
    send_match = re.search(
        r'resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"',
        ui_dump["output"]
    )
    
    if send_match:
        x1, y1, x2, y2 = map(int, send_match.groups())
        send_x = (x1 + x2) // 2
        send_y = (y1 + y2) // 2
        run_adb(f'shell input tap {send_x} {send_y}')
    else:
        # Fallback coordinates
        run_adb('shell input tap 671 802')
    
    return {
        "success": True,
        "message": f"Message sent to {data.contact}",
        "contact": data.contact
    }

@app.post("/execute-plan")
async def execute_plan(plan: AutomationPlan):
    """Execute automation plan"""
    results = []
    
    for step in plan.steps:
        try:
            if step.action == "whatsapp":
                # Use the working WhatsApp method
                result = await send_whatsapp(
                    WhatsAppMessage(contact=step.target, message=step.text)
                )
                results.append({
                    "step": step.action,
                    "reasoning": step.reasoning,
                    "success": True,
                    "output": result
                })
            
            elif step.action == "wait":
                wait_ms = int(step.target) / 1000
                subprocess.run(['sleep', str(wait_ms)], check=False)
                results.append({
                    "step": step.action,
                    "reasoning": step.reasoning,
                    "success": True
                })
            
            elif step.action == "tap":
                x, y = step.target.split(',')
                result = run_adb(f'shell input tap {x} {y}')
                results.append({
                    "step": step.action,
                    "reasoning": step.reasoning,
                    "success": result["success"],
                    "output": result["output"]
                })
            
            elif step.action == "open_url":
                result = run_adb(f'shell am start -a android.intent.action.VIEW -d "{step.target}"')
                results.append({
                    "step": step.action,
                    "reasoning": step.reasoning,
                    "success": result["success"],
                    "output": result["output"]
                })
            
            else:
                results.append({
                    "step": step.action,
                    "reasoning": step.reasoning,
                    "success": False,
                    "error": f"Unknown action: {step.action}"
                })
        
        except Exception as e:
            results.append({
                "step": step.action,
                "reasoning": step.reasoning,
                "success": False,
                "error": str(e)
            })
    
    return {
        "success": True,
        "results": results
    }

@app.post("/adb")
async def execute_adb_command(command: dict):
    """Execute raw ADB command"""
    if "command" not in command:
        raise HTTPException(status_code=400, detail="Missing 'command' field")
    
    result = run_adb(command["command"])
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
