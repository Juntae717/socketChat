package com.socket.socketChat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class SocketChatApplication extends ServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(SocketChatApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) { return builder.sources(SocketChatApplication.class); }
}
