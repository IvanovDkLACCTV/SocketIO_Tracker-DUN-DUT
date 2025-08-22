using Quobject.SocketIoClientDotNet.Client;
using System;

class Program
{
    static void Main()
    {
        var socket = IO.Socket("http://127.0.0.1:7070/receiver");

        socket.On(Socket.EVENT_CONNECT, () =>
        {
            Console.WriteLine("Connected");
        });

        socket.On("gps_update", (data) =>
        {
            Console.WriteLine(data);
        });

        Console.ReadLine(); 
    }
}
