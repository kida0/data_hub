-- DataHub 데이터베이스 초기화 스크립트

-- Insights 테이블
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objective VARCHAR(100),
    status VARCHAR(50),
    impact_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metrics 테이블
CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    value FLOAT,
    unit VARCHAR(50),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT '비활성화',
    version VARCHAR(20),
    metric_owner VARCHAR(100),
    priority VARCHAR(10),
    calculation_logic TEXT,
    alert_settings TEXT,
    data_source TEXT,
    aggregation_period VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Segments 테이블
CREATE TABLE IF NOT EXISTS segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    customer_count INTEGER,
    category VARCHAR(100),
    metric1_value VARCHAR(50),
    metric1_label VARCHAR(100),
    metric2_value VARCHAR(50),
    metric2_label VARCHAR(100),
    metric3_value VARCHAR(50),
    metric3_label VARCHAR(100),
    last_touch_channel VARCHAR(50),
    last_touch_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metric Data Points 테이블 (시계열 데이터 저장)
CREATE TABLE IF NOT EXISTS metric_data_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_id INTEGER NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (metric_id) REFERENCES metrics(id) ON DELETE CASCADE
);

-- 샘플 데이터 삽입
INSERT INTO insights (title, description, objective, status, impact_score) VALUES
    ('첫 구매 전환율 향상', '신규 가입 후 7일 이내 첫 구매 전환율이 15% 증가', '첫 구매 전환', '활성', 8.5),
    ('재구매율 증가', '기존 고객의 재구매율이 20% 향상', '재구매 촉진', '활성', 7.8),
    ('이탈률 감소', '90일 이상 비활성 고객이 30% 감소', '이탈 방지', '검토 중', 6.5);

INSERT INTO metrics (name, description, value, unit, category, status, version, metric_owner, priority, calculation_logic, data_source, aggregation_period) VALUES
    ('결제 전환율', '방문자 중 결제 완료한 비율 (Payment CVR)', 3.8, '%', 'Conversion', '활성화', 'v2.1.3', '키다', 'P0', '결제 성공 건수 / 결제 화면 진입 건수 * 100', 'payment_events, user_journey_logs', '일별'),
    ('MAU', '월간 활성 사용자 수 (Monthly Active Users)', 15420, '명', 'Engagement', '활성화', 'v2.1.3', '키다', 'P1', 'COUNT(DISTINCT user_id) WHERE last_active >= DATE_SUB(NOW(), INTERVAL 30 DAY)', 'user_activity_logs', '월별'),
    ('DAU', '일일 활성 사용자 수 (Daily Active Users)', 5230, '명', 'Engagement', '활성화', 'v2.1.3', '키다', 'P1', 'COUNT(DISTINCT user_id) WHERE DATE(last_active) = CURRENT_DATE', 'user_activity_logs', '일별'),
    ('WAU', '주간 활성 사용자 수 (Weekly Active Users)', 9850, '명', 'Engagement', '활성화', 'v2.1.2', '키다', 'P2', 'COUNT(DISTINCT user_id) WHERE last_active >= DATE_SUB(NOW(), INTERVAL 7 DAY)', 'user_activity_logs', '주별'),
    ('신규 가입자 수', '일일 신규 가입자 수', 342, '명', 'Engagement', '활성화', 'v2.1.3', '키다', 'P2', 'COUNT(user_id) WHERE DATE(created_at) = CURRENT_DATE', 'users', '일별'),
    ('장바구니 전환율', '방문자 중 장바구니 추가한 비율', 12.5, '%', 'Conversion', '활성화', 'v2.1.1', '키다', 'P1', 'COUNT(cart_add_events) / COUNT(session_id) * 100', 'cart_events, sessions', '일별'),
    ('가입 전환율', '방문자 중 회원가입한 비율', 8.2, '%', 'Conversion', '활성화', 'v2.1.3', '키다', 'P2', 'COUNT(signup_events) / COUNT(visitor_id) * 100', 'signup_events, visitors', '일별'),
    ('평균 주문 금액', '주문당 평균 결제 금액 (AOV)', 58500, '원', 'Revenue', '활성화', 'v2.1.3', '키다', 'P0', 'SUM(order_amount) / COUNT(order_id)', 'orders', '일별'),
    ('고객 생애 가치', '고객당 평균 생애 가치 (LTV)', 245000, '원', 'Revenue', '활성화', 'v2.1.0', '키다', 'P1', 'SUM(total_revenue) / COUNT(DISTINCT customer_id)', 'orders, customers', '월별'),
    ('월간 매출', '월간 총 매출액 (MRR)', 450000000, '원', 'Revenue', '활성화', 'v2.1.3', '키다', 'P0', 'SUM(order_amount) WHERE MONTH(order_date) = MONTH(NOW())', 'orders', '월별'),
    ('일일 매출', '일일 총 매출액', 15000000, '원', 'Revenue', '활성화', 'v2.1.3', '키다', 'P1', 'SUM(order_amount) WHERE DATE(order_date) = CURRENT_DATE', 'orders', '일별'),
    ('재구매율', '이전 구매 고객 중 재구매한 비율', 28.5, '%', 'Retention', '활성화', 'v2.1.2', '키다', 'P1', 'COUNT(DISTINCT customer_id WHERE order_count > 1) / COUNT(DISTINCT customer_id) * 100', 'orders', '월별'),
    ('이탈률', '월간 고객 이탈률 (Churn Rate)', 5.2, '%', 'Retention', '주의', 'v2.1.3', '키다', 'P0', 'COUNT(churned_customers) / COUNT(total_customers) * 100', 'customers', '월별'),
    ('고객 유지율', '고객 유지율 (Retention Rate)', 78.3, '%', 'Retention', '활성화', 'v2.1.3', '키다', 'P1', '(1 - churn_rate) * 100', 'customers', '월별'),
    ('평균 재구매 주기', '재구매까지 평균 소요 일수', 42, '일', 'Retention', '활성화', 'v2.0.8', '키다', 'P2', 'AVG(DATEDIFF(next_order_date, previous_order_date))', 'orders', '월별'),
    ('장바구니 이탈률', '장바구니 추가 후 미결제 비율', 68.5, '%', 'Conversion', '주의', 'v2.1.1', '키다', 'P2', '(COUNT(cart_add) - COUNT(checkout_complete)) / COUNT(cart_add) * 100', 'cart_events, checkout_events', '일별'),
    ('페이지 방문수', '일일 평균 페이지 뷰', 125000, '회', 'Traffic', '활성화', 'v2.1.3', '키다', 'P3', 'COUNT(page_view_events) WHERE DATE(event_time) = CURRENT_DATE', 'page_view_events', '일별'),
    ('세션 시간', '방문당 평균 체류 시간', 8.5, '분', 'Traffic', '활성화', 'v2.1.3', '키다', 'P3', 'AVG(session_duration) / 60', 'sessions', '일별'),
    ('이탈률', '첫 페이지에서 이탈한 비율 (Bounce Rate)', 42.3, '%', 'Traffic', '비활성화', 'v2.0.5', '키다', 'P2', 'COUNT(single_page_sessions) / COUNT(total_sessions) * 100', 'sessions', '일별'),
    ('세션당 페이지뷰', '세션당 평균 페이지 조회수', 4.2, '회', 'Traffic', '활성화', 'v2.1.3', '키다', 'P3', 'COUNT(page_views) / COUNT(DISTINCT session_id)', 'page_views, sessions', '일별'),
    ('모바일 전환율', '모바일 방문자 결제 전환율', 2.8, '%', 'Conversion', '활성화', 'v2.1.3', '키다', 'P1', 'COUNT(mobile_purchases) / COUNT(mobile_visitors) * 100', 'orders, visitors', '일별'),
    ('데스크탑 전환율', '데스크탑 방문자 결제 전환율', 4.9, '%', 'Conversion', '활성화', 'v2.1.3', '키다', 'P1', 'COUNT(desktop_purchases) / COUNT(desktop_visitors) * 100', 'orders, visitors', '일별'),
    ('고객 획득 비용', '신규 고객 1명당 획득 비용 (CAC)', 15000, '원', 'Marketing', '활성화', 'v2.1.2', '키다', 'P0', 'SUM(marketing_spend) / COUNT(new_customers)', 'marketing_campaigns, customers', '월별'),
    ('ROI', '마케팅 투자 대비 수익률', 3.5, '배', 'Marketing', '활성화', 'v2.1.3', '키다', 'P0', '(SUM(revenue) - SUM(marketing_spend)) / SUM(marketing_spend)', 'orders, marketing_campaigns', '월별'),
    ('이메일 오픈율', '발송 이메일 중 오픈율', 24.5, '%', 'Marketing', '활성화', 'v2.1.1', '키다', 'P2', 'COUNT(email_opens) / COUNT(emails_sent) * 100', 'email_events', '일별'),
    ('이메일 클릭률', '오픈한 이메일 중 클릭율 (CTR)', 12.8, '%', 'Marketing', '활성화', 'v2.1.1', '키다', 'P2', 'COUNT(email_clicks) / COUNT(email_opens) * 100', 'email_events', '일별'),
    ('푸시 알림 오픈율', '푸시 알림 발송 중 오픈율', 8.3, '%', 'Marketing', '비활성화', 'v2.0.7', '키다', 'P3', 'COUNT(push_opens) / COUNT(push_sent) * 100', 'push_events', '일별'),
    ('평균 배송 시간', '주문 후 배송 완료까지 평균 시간', 2.3, '일', 'Operations', '활성화', 'v2.1.3', '키다', 'P1', 'AVG(DATEDIFF(delivery_date, order_date))', 'orders, deliveries', '일별'),
    ('주문 취소율', '전체 주문 중 취소된 비율', 3.2, '%', 'Operations', '활성화', 'v2.1.2', '키다', 'P2', 'COUNT(cancelled_orders) / COUNT(total_orders) * 100', 'orders', '일별'),
    ('반품률', '배송 완료 후 반품 비율', 4.1, '%', 'Operations', '활성화', 'v2.1.2', '키다', 'P2', 'COUNT(returns) / COUNT(delivered_orders) * 100', 'orders, returns', '일별');

INSERT INTO segments (name, description, customer_count, category, metric1_value, metric1_label, metric2_value, metric2_label, metric3_value, metric3_label, last_touch_channel, last_touch_date) VALUES
    ('최근 30일 활성 유저', '지난 30일 동안 1회 이상 로그인하고 핵심 기능을 사용한 활성 사용자 그룹', 42847, 'User Behavior', '68.3%', '전체 유저 대비', '18.5분', '평균 세션', '73.2%', '30일 유지율', '이메일', '2024-12-12'),
    ('신규 가입자', '최근 30일 내 가입, 첫 구매 미완료', 24521, '신규 획득', '68.4%', '앱 실행률', '34.2%', '장바구니', '12.8%', '첫구매 전환', '푸시', '2024-12-09'),
    ('이탈 위험군', '90일 이상 미방문, 과거 활성 고객', 18392, '재활성화', '3.2M', '평균 LTV', '127일', '미방문 일수', '38.5%', '회복 가능성', NULL, NULL),
    ('충성 고객', '12개월 이상 연속 구매, 월 평균 2회 이상', 45210, '리텐션', '2.4M', '평균 구매액', '82점', 'NPS 점수', '45.2%', '추천율', 'SMS', '2024-12-07'),
    ('가격 민감군', '할인/프로모션 시에만 구매, 쿠폰 사용률 높음', 67834, '리텐션', '94.2%', '쿠폰 사용률', '88.7%', '할인 구매율', '15.3%', '평균 할인액', '이메일', '2024-12-11'),
    ('잠재 고객', '앱 설치 후 브라우징만, 구매 미전환', 156920, '신규 획득', '3.2분', '체류시간', '8.4회', '페이지뷰', '2.1개', '관심 카테고리', '푸시', '2024-12-04'),
    ('재구매 고객', '최근 3개월 내 2회 이상 구매', 32145, '리텐션', '1.8M', '평균 구매액', '28일', '구매 주기', '72.3%', '재구매율', '이메일', '2024-12-13'),
    ('일회성 구매자', '첫 구매 후 재구매 없음 (90일 경과)', 89342, '재활성화', '580K', '첫 구매액', '95일', '경과 일수', '18.2%', '재구매 가능성', 'SMS', '2024-12-08'),
    ('고가 상품 선호군', '50만원 이상 상품 주로 구매', 8920, 'VIP 관리', '12.5M', '평균 구매액', '3.2회', '연간 구매', '92.8%', '만족도', '이메일', '2024-12-13'),
    ('모바일 전용 고객', '모바일 앱에서만 구매', 124580, '리텐션', '54.3%', '앱 구매율', '8.2회', '월평균 방문', '35.7%', '전환율', '푸시', '2024-12-12'),
    ('이벤트 참여 활성군', '프로모션/이벤트 참여율 높음', 45892, '신규 획득', '87.5%', '이벤트 참여율', '6.8회', '월평균 참여', '42.3%', '전환율', '푸시', '2024-12-13'),
    ('브랜드 로열티 고객', '특정 브랜드만 구매', 15670, 'VIP 관리', '3.5M', '브랜드 구매액', '85.2%', '브랜드 집중도', '68.9%', '재구매율', '이메일', '2024-12-11'),
    ('카테고리 탐색군', '다양한 카테고리 탐색, 구매 전환 낮음', 78234, '신규 획득', '5.2분', '체류시간', '12.8개', '탐색 카테고리', '8.9%', '전환율', NULL, NULL),
    ('할인 대기군', '장바구니 담은 후 구매 대기', 34567, '재활성화', '1.2M', '장바구니 금액', '18일', '대기 일수', '45.8%', '구매 가능성', '이메일', '2024-12-10'),
    ('반품 빈발군', '구매 후 반품률 높음', 5421, '리텐션', '3.8회', '반품 횟수', '42.3%', '반품률', '620K', '평균 구매액', NULL, NULL),
    ('주말 쇼핑족', '주말에만 구매 활동', 56789, '리텐션', '78.5%', '주말 구매율', '1.5M', '평균 구매액', '24.3%', '전환율', 'SMS', '2024-12-08'),
    ('새벽 특가 선호군', '새벽 타임딜 적극 활용', 23456, '리텐션', '92.7%', '새벽 구매율', '35.8%', '할인 구매율', '880K', '평균 구매액', '푸시', '2024-12-13'),
    ('선물 구매 고객', '선물 포장 옵션 자주 사용', 18934, '신규 획득', '68.9%', '선물 비율', '2.8회', '연간 구매', '1.5M', '평균 구매액', '이메일', '2024-12-09'),
    ('대량 구매 고객', '1회 구매 시 여러 상품 대량 구매', 9876, 'VIP 관리', '5.8M', '평균 구매액', '8.5개', '평균 구매수', '52.3%', '재구매율', '이메일', '2024-12-12'),
    ('리뷰 작성 활성군', '구매 후 리뷰 작성률 높음', 34821, '리텐션', '89.5%', '리뷰 작성률', '4.2점', '평균 평점', '72.8%', '재구매율', '이메일', '2024-12-11');

