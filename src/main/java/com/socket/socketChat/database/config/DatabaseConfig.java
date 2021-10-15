package com.socket.socketChat.database.config;

import com.zaxxer.hikari.HikariConfig;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

public abstract class DatabaseConfig extends HikariConfig {
    protected void setConfigureEntityManagerFactory(LocalContainerEntityManagerFactoryBean factory) {
        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        factory.setJpaVendorAdapter(vendorAdapter);

        // LINE :: 하이버네이트 설정
        Map<String, Object> hibernateOption = new HashMap<String, Object>();
        hibernateOption.put("hibernate.dialect", "org.hibernate.dialect.MySQL57Dialect"); // LINE :: 방언
        hibernateOption.put("hibernate.physical_naming_strategy", "org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy"); // LINE :: 컬럼 네이밍 규칙
        hibernateOption.put("hibernate.show_sql", "true"); // LINE :: 쿼리 노출
        hibernateOption.put("hibernate.hbm2ddl.auto", "update"); // LINE :: DDL 자동 업데이트
        hibernateOption.put("hibernate.format_sql", "true"); // LINE :: 형식화된 SQL 문을 보여줌. Beautifier 기능
        hibernateOption.put("hibernate.enable_lazy_load_no_trans", "true"); // LINE :: Lazy Load 설정

        factory.setJpaPropertyMap(hibernateOption);
        factory.afterPropertiesSet();
    }

    protected void setConfigureSqlSessionFactory(SqlSessionFactoryBean sqlSessionFactoryBean, DataSource dataSource) throws Exception {
        sqlSessionFactoryBean.setDataSource(dataSource);
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources("classpath:mapper/**/*.xml"));
        sqlSessionFactoryBean.setTypeAliasesPackage("com.socket.socketChat.database.mybatis.dto"); // LINE :: Domain 패키지 경로
        sqlSessionFactoryBean.getObject().getConfiguration().setMapUnderscoreToCamelCase(true); // LINE :: 카멜표기법 설정
    }
}
