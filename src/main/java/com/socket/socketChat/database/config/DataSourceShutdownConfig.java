package com.socket.socketChat.database.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PreDestroy;
import javax.sql.DataSource;

@Configuration
public class DataSourceShutdownConfig {
    private final HikariDataSource hikariDataSource;

    public DataSourceShutdownConfig(@Qualifier("dataSource") DataSource dataSource) {
        if (dataSource instanceof HikariDataSource) {
            this.hikariDataSource = (HikariDataSource) dataSource;
        } else {
            this.hikariDataSource = (HikariDataSource)((org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy)dataSource).getTargetDataSource();
        }
    }

    @PreDestroy
    public void cleanup() {
        try {
            Class<?> clazz = Class.forName("com.mysql.cj.jdbc.AbandonedConnectionCleanupThread");
            clazz.getMethod("checkedShutdown").invoke(null);
        } catch (Exception e) {
            // 클래스 없으면 무시
        }
    }
}
