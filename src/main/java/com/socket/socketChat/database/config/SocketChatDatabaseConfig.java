package com.socket.socketChat.database.config;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@ConfigurationProperties(prefix = "spring.datasource.main")
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.socket.socketChat.database",
        entityManagerFactoryRef = "EntityManagerFactory",
        transactionManagerRef = "dataTransactionManager")
@MapperScan(basePackages = "com.socket.socketChat.database.mybatis.mapper", sqlSessionFactoryRef = "sqlSessionFactory")
public class SocketChatDatabaseConfig extends DatabaseConfig {
        @Bean(name = "dataSource")
        @Primary
        public DataSource dataSourceForData(){
            return new LazyConnectionDataSourceProxy(new HikariDataSource(this));
        }

        @Bean(name = "EntityManagerFactory")
        @Primary
        public EntityManagerFactory entityManagerFactory(@Qualifier("dataSource") DataSource dataSourceForData) {
            LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
            factory.setDataSource(dataSourceForData);
            factory.setPackagesToScan("com.socket.socketChat.database");
            factory.setPersistenceUnitName("socketChat");
            setConfigureEntityManagerFactory(factory);

            return factory.getObject();
        }

        @Bean
        @Primary
        public PlatformTransactionManager dataTransactionManager(@Qualifier("EntityManagerFactory") final EntityManagerFactory entityManagerFactory) {
            return new JpaTransactionManager(entityManagerFactory);
        }

        @Bean(name = "sqlSessionFactory")
        public SqlSessionFactory sqlSessionFactory(@Qualifier("dataSource") DataSource dataSourceForData) throws Exception{
            SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
            setConfigureSqlSessionFactory(sessionFactoryBean, dataSourceForData);

            return sessionFactoryBean.getObject();
        }

        @Bean(name = "sqlSession")
        public SqlSessionTemplate sqlSession(@Qualifier("sqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
            return new SqlSessionTemplate(sqlSessionFactory);
        }
}
