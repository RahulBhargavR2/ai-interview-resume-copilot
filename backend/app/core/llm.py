from ollama import Client

client = Client()

try:
    models = client.list()
    print('Ollama is running...')
except Exception as e:
    print('Ollama servies is not active')