import socketio
import asyncio
import sys

# Create client
sio = socketio.AsyncClient(logger=True, engineio_logger=True)

@sio.event
async def connect():
    print("TEST_CLIENT: Connected")
    # Join chat 1
    print("TEST_CLIENT: Joining chat 1")
    await sio.emit('join_chat', 1)

@sio.event
async def connect_error(data):
    print(f"TEST_CLIENT: Connection Error: {data}")

@sio.event
async def disconnect():
    print("TEST_CLIENT: Disconnected")

@sio.event
async def new_message(data):
    print(f"TEST_CLIENT: RECEIVED MESSAGE: {data}")

@sio.event
async def status(data):
    print(f"TEST_CLIENT: STATUS: {data}")

async def main():
    try:
        # Connect to backend
        # Note: server is at localhost:8001
        print("TEST_CLIENT: Connecting...")
        await sio.connect('http://127.0.0.1:8001', socketio_path='/socket.io', transports=['websocket'])
        
        # Keep alive for a bit to receive messages
        await asyncio.sleep(10)
        
        await sio.disconnect()
    except Exception as e:
        print(f"TEST_CLIENT: Exception: {e}")

if __name__ == '__main__':
    asyncio.run(main())
