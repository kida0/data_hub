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
    segment_owner VARCHAR(100),
    category VARCHAR(100),
    tags TEXT,
    refresh_period VARCHAR(50),
    query TEXT,
    customer_count INTEGER,
    metric1_value VARCHAR(50),
    metric1_label VARCHAR(100),
    metric2_value VARCHAR(50),
    metric2_label VARCHAR(100),
    metric3_value VARCHAR(50),
    metric3_label VARCHAR(100),
    metric4_value VARCHAR(50),
    metric4_label VARCHAR(100),
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

INSERT INTO segments (name, description, segment_owner, category, tags, refresh_period, query, customer_count, metric1_value, metric1_label, metric2_value, metric2_label, metric3_value, metric3_label, metric4_value, metric4_label, last_touch_channel, last_touch_date) VALUES
    (
        '최근 30일 활성 유저',
        '지난 30일 동안 1회 이상 로그인하고 핵심 기능을 사용한 활성 사용자 그룹',
        '키다',
        'User Behavior',
        '활성유저,마케팅,리텐션',
        '일별',
        'SELECT user_id FROM user_sessions WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND session_count >= 3',
        42847,
        '68.3%', '전체 유저 대비',
        '18.5분', '평균 세션',
        '73.2%', '30일 유지율',
        '+5.2%', '주간 증가율',
        '이메일', '2024-12-12'
    ),
    (
        '신규 가입자',
        '최근 30일 내 가입, 첫 구매 미완료',
        '키다',
        '신규 획득',
        '신규유저,전환,온보딩',
        '일별',
        'SELECT user_id FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND first_purchase_at IS NULL',
        24521,
        '68.4%', '앱 실행률',
        '34.2%', '장바구니',
        '12.8%', '첫구매 전환',
        '+12.3%', '주간 증가율',
        '푸시', '2024-12-09'
    ),
    (
        '이탈 위험군',
        '90일 이상 미방문, 과거 활성 고객',
        '키다',
        '재활성화',
        '이탈방지,재활성화,리텐션',
        '주별',
        'SELECT user_id FROM users WHERE last_login < DATE_SUB(NOW(), INTERVAL 90 DAY) AND lifetime_value > 1000000',
        18392,
        '3.2M', '평균 LTV',
        '127일', '미방문 일수',
        '38.5%', '회복 가능성',
        '-5.8%', '주간 변화',
        NULL, NULL
    ),
    (
        '충성 고객',
        '12개월 이상 연속 구매, 월 평균 2회 이상',
        '키다',
        '리텐션',
        'VIP,충성고객,프리미엄',
        '일별',
        'SELECT user_id FROM users WHERE purchase_months >= 12 AND avg_monthly_purchase >= 2',
        45210,
        '2.4M', '평균 구매액',
        '82점', 'NPS 점수',
        '45.2%', '추천율',
        '92.1%', '만족도',
        'SMS', '2024-12-07'
    ),
    (
        '가격 민감군',
        '할인/프로모션 시에만 구매, 쿠폰 사용률 높음',
        '키다',
        '리텐션',
        '할인,프로모션,쿠폰',
        '일별',
        'SELECT user_id FROM users WHERE coupon_usage_rate > 0.9 AND discount_purchase_rate > 0.85',
        67834,
        '94.2%', '쿠폰 사용률',
        '88.7%', '할인 구매율',
        '15.3%', '평균 할인액',
        '+8.4%', '주간 증가율',
        '이메일', '2024-12-11'
    );

-- Add visitor_count column to metric_data_points
ALTER TABLE metric_data_points ADD COLUMN visitor_count INTEGER;

-- Insert sample time series data for metric_id=1 (결제 전환율)
-- 최근 90일간 데이터 (7일, 30일, 90일 모두 조회 가능하도록)
INSERT INTO metric_data_points (metric_id, value, visitor_count, timestamp) VALUES
    (1, 4.2, 4856, datetime('now', '-89 days')),
    (1, 4.1, 4923, datetime('now', '-88 days')),
    (1, 3.9, 5102, datetime('now', '-87 days')),
    (1, 4.3, 4745, datetime('now', '-86 days')),
    (1, 4.0, 4889, datetime('now', '-85 days')),
    (1, 3.8, 5234, datetime('now', '-84 days')),
    (1, 4.2, 4678, datetime('now', '-83 days')),
    (1, 4.4, 4512, datetime('now', '-82 days')),
    (1, 4.1, 4967, datetime('now', '-81 days')),
    (1, 3.9, 5089, datetime('now', '-80 days')),
    (1, 4.0, 4834, datetime('now', '-79 days')),
    (1, 4.3, 4701, datetime('now', '-78 days')),
    (1, 4.2, 4923, datetime('now', '-77 days')),
    (1, 3.8, 5156, datetime('now', '-76 days')),
    (1, 4.1, 4789, datetime('now', '-75 days')),
    (1, 4.5, 4445, datetime('now', '-74 days')),
    (1, 4.2, 4812, datetime('now', '-73 days')),
    (1, 4.0, 4978, datetime('now', '-72 days')),
    (1, 3.9, 5123, datetime('now', '-71 days')),
    (1, 4.3, 4656, datetime('now', '-70 days')),
    (1, 4.1, 4890, datetime('now', '-69 days')),
    (1, 4.2, 4734, datetime('now', '-68 days')),
    (1, 3.8, 5201, datetime('now', '-67 days')),
    (1, 4.0, 4945, datetime('now', '-66 days')),
    (1, 4.4, 4567, datetime('now', '-65 days')),
    (1, 4.1, 4823, datetime('now', '-64 days')),
    (1, 3.9, 5067, datetime('now', '-63 days')),
    (1, 4.2, 4712, datetime('now', '-62 days')),
    (1, 4.3, 4689, datetime('now', '-61 days')),
    (1, 4.0, 4956, datetime('now', '-60 days')),
    (1, 3.8, 5178, datetime('now', '-59 days')),
    (1, 4.1, 4801, datetime('now', '-58 days')),
    (1, 4.4, 4534, datetime('now', '-57 days')),
    (1, 4.2, 4768, datetime('now', '-56 days')),
    (1, 3.9, 5098, datetime('now', '-55 days')),
    (1, 4.0, 4912, datetime('now', '-54 days')),
    (1, 4.3, 4678, datetime('now', '-53 days')),
    (1, 4.1, 4845, datetime('now', '-52 days')),
    (1, 3.8, 5189, datetime('now', '-51 days')),
    (1, 4.2, 4723, datetime('now', '-50 days')),
    (1, 4.5, 4456, datetime('now', '-49 days')),
    (1, 4.1, 4889, datetime('now', '-48 days')),
    (1, 3.9, 5045, datetime('now', '-47 days')),
    (1, 4.0, 4934, datetime('now', '-46 days')),
    (1, 4.3, 4689, datetime('now', '-45 days')),
    (1, 4.2, 4756, datetime('now', '-44 days')),
    (1, 3.8, 5167, datetime('now', '-43 days')),
    (1, 4.1, 4812, datetime('now', '-42 days')),
    (1, 4.4, 4523, datetime('now', '-41 days')),
    (1, 4.0, 4967, datetime('now', '-40 days')),
    (1, 3.9, 5112, datetime('now', '-39 days')),
    (1, 4.2, 4745, datetime('now', '-38 days')),
    (1, 4.3, 4667, datetime('now', '-37 days')),
    (1, 4.1, 4834, datetime('now', '-36 days')),
    (1, 3.8, 5198, datetime('now', '-35 days')),
    (1, 4.0, 4923, datetime('now', '-34 days')),
    (1, 4.4, 4545, datetime('now', '-33 days')),
    (1, 4.2, 4789, datetime('now', '-32 days')),
    (1, 3.9, 5078, datetime('now', '-31 days')),
    (1, 4.1, 4856, datetime('now', '-30 days')),
    (1, 4.3, 4701, datetime('now', '-29 days')),
    (1, 4.0, 4945, datetime('now', '-28 days')),
    (1, 3.8, 5156, datetime('now', '-27 days')),
    (1, 4.2, 4767, datetime('now', '-26 days')),
    (1, 4.5, 4434, datetime('now', '-25 days')),
    (1, 4.1, 4878, datetime('now', '-24 days')),
    (1, 3.9, 5089, datetime('now', '-23 days')),
    (1, 4.0, 4912, datetime('now', '-22 days')),
    (1, 4.4, 4556, datetime('now', '-21 days')),
    (1, 4.2, 4734, datetime('now', '-20 days')),
    (1, 3.8, 5201, datetime('now', '-19 days')),
    (1, 4.1, 4823, datetime('now', '-18 days')),
    (1, 4.3, 4678, datetime('now', '-17 days')),
    (1, 4.0, 4956, datetime('now', '-16 days')),
    (1, 3.9, 5134, datetime('now', '-15 days')),
    (1, 4.2, 4745, datetime('now', '-14 days')),
    (1, 4.4, 4512, datetime('now', '-13 days')),
    (1, 4.1, 4867, datetime('now', '-12 days')),
    (1, 3.8, 5178, datetime('now', '-11 days')),
    (1, 4.0, 4934, datetime('now', '-10 days')),
    (1, 4.3, 4689, datetime('now', '-9 days')),
    (1, 4.2, 4756, datetime('now', '-8 days')),
    (1, 3.9, 5098, datetime('now', '-7 days')),
    (1, 4.1, 4812, datetime('now', '-6 days')),
    (1, 4.5, 4445, datetime('now', '-5 days')),
    (1, 4.2, 4778, datetime('now', '-4 days')),
    (1, 3.8, 5189, datetime('now', '-3 days')),
    (1, 4.0, 4923, datetime('now', '-2 days')),
    (1, 4.3, 4667, datetime('now', '-1 days')),
    (1, 4.1, 4845, datetime('now'));

-- Campaigns 테이블 (실험/캠페인 정보)
CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Segment-Campaign 연결 테이블
CREATE TABLE IF NOT EXISTS segment_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    segment_id INTEGER NOT NULL,
    campaign_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (segment_id) REFERENCES segments(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- 샘플 캠페인 데이터
INSERT INTO campaigns (name, description, status) VALUES
    ('프리미엄 전환 캠페인', '활성 유저 대상 프리미엄 구독 전환', 'active'),
    ('신규 기능 안내', '최신 업데이트 기능 소개', 'active'),
    ('웰컴 온보딩', '신규 가입자 환영 및 가이드', 'active'),
    ('첫 구매 할인', '첫 구매 고객 대상 특별 할인', 'active'),
    ('재활성화 이벤트', '휴면 고객 복귀 유도', 'active'),
    ('VIP 리워드', '충성 고객 대상 리워드 프로그램', 'active'),
    ('쿠폰 자동발급', '가격 민감 고객 대상 쿠폰', 'active'),
    ('추천 리워드', '친구 추천 이벤트', 'active');

-- 세그먼트-캠페인 연결 데이터
-- 세그먼트 1 (최근 30일 활성 유저): 프리미엄 전환 캠페인, 신규 기능 안내, 추천 리워드
INSERT INTO segment_campaigns (segment_id, campaign_id) VALUES
    (1, 1),
    (1, 2),
    (1, 8);

-- 세그먼트 2 (신규 가입자): 웰컴 온보딩, 첫 구매 할인, 신규 기능 안내, 추천 리워드, VIP 리워드
INSERT INTO segment_campaigns (segment_id, campaign_id) VALUES
    (2, 3),
    (2, 4),
    (2, 2),
    (2, 8),
    (2, 6);

-- 세그먼트 3 (이탈 위험군): 재활성화 이벤트, 쿠폰 자동발급
INSERT INTO segment_campaigns (segment_id, campaign_id) VALUES
    (3, 5),
    (3, 7);

-- 세그먼트 4 (충성 고객): VIP 리워드
INSERT INTO segment_campaigns (segment_id, campaign_id) VALUES
    (4, 6);

-- 세그먼트 5 (가격 민감군): 쿠폰 자동발급, 첫 구매 할인, 재활성화 이벤트, 추천 리워드
INSERT INTO segment_campaigns (segment_id, campaign_id) VALUES
    (5, 7),
    (5, 4),
    (5, 5),
    (5, 8);

-- Experiments 테이블 (A/B 테스트 및 실험 관리)
CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- 기본 정보
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner VARCHAR(100) NOT NULL,
    team VARCHAR(100),
    experiment_type VARCHAR(50) DEFAULT 'A/B Test',
    status VARCHAR(50) DEFAULT 'draft',

    -- 목표 및 가설
    objective VARCHAR(100),
    hypothesis TEXT NOT NULL,
    ice_impact INTEGER,
    ice_confidence INTEGER,
    ice_ease INTEGER,

    -- 메트릭
    primary_metric_id INTEGER,
    secondary_metric_ids TEXT,

    -- 기간 및 대상
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_segment_id INTEGER,

    -- Variants (JSON 배열)
    variants TEXT NOT NULL,

    -- 통계 설정 (기본값)
    minimum_detectable_effect FLOAT DEFAULT 5.0,
    statistical_significance FLOAT DEFAULT 95.0,
    statistical_power FLOAT DEFAULT 80.0,

    -- 추가 정보
    conditions TEXT,
    confounding_factors TEXT,

    -- 실행 결과 (나중에 업데이트)
    progress FLOAT DEFAULT 0.0,
    days_left INTEGER,

    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (primary_metric_id) REFERENCES metrics(id),
    FOREIGN KEY (target_segment_id) REFERENCES segments(id)
);

-- 샘플 실험 데이터
INSERT INTO experiments (name, description, owner, team, experiment_type, status, objective, hypothesis, ice_impact, ice_confidence, ice_ease, primary_metric_id, secondary_metric_ids, start_date, end_date, target_segment_id, variants, minimum_detectable_effect, statistical_significance, statistical_power, conditions, confounding_factors, progress, days_left) VALUES
    (
        '프리미엄 전환 CTA 버튼 색상 테스트',
        '프리미엄 구독 페이지의 CTA 버튼 색상을 변경하여 전환율 개선을 목표로 하는 실험',
        '키다',
        'Data Team',
        'A/B Test',
        'running',
        '프리미엄 전환',
        'CTA 버튼 색상을 더 눈에 띄는 색으로 변경하면 사용자의 주의를 끌어 전환율이 향상될 것이다',
        9,
        8,
        10,
        1,
        '["2", "3"]',
        '2024-12-01',
        '2024-12-22',
        1,
        '[{"name": "Control", "description": "기존 파란색 버튼", "traffic_allocation": 50}, {"name": "Variant A", "description": "주황색 버튼", "traffic_allocation": 50}]',
        5.0,
        95.0,
        80.0,
        '프리미엄 구독 페이지, 로그인 사용자 대상',
        '12월 연말 프로모션 시즌과 겹침',
        45.0,
        8
    ),
    (
        '상품 상세 페이지 이미지 크기 최적화',
        '상품 이미지 크기를 확대하여 구매 전환율을 개선하는 실험',
        '민지',
        'Product Team',
        'A/B Test',
        'running',
        '구매 전환',
        '상품 이미지를 더 크게 보여주면 제품에 대한 이해도가 높아져 구매 전환율이 증가할 것이다',
        8,
        7,
        9,
        1,
        '["8"]',
        '2024-11-28',
        '2024-12-17',
        2,
        '[{"name": "Control", "description": "현재 이미지 크기 (600x600)", "traffic_allocation": 50}, {"name": "Variant A", "description": "확대된 이미지 (800x800)", "traffic_allocation": 50}]',
        5.0,
        95.0,
        80.0,
        '상품 상세 페이지, 모든 방문자 대상',
        NULL,
        78.0,
        3
    ),
    (
        '장바구니 플로팅 버튼 추가',
        '상품 페이지에 플로팅 장바구니 버튼을 추가하여 장바구니 추가율을 개선하는 실험',
        '준호',
        'UX Team',
        'A/B Test',
        'analyzing',
        '장바구니 추가율',
        '항상 보이는 플로팅 장바구니 버튼을 추가하면 사용자가 더 쉽게 상품을 장바구니에 담을 수 있어 추가율이 증가할 것이다',
        7,
        8,
        8,
        6,
        '["1"]',
        '2024-11-18',
        '2024-12-08',
        2,
        '[{"name": "Control", "description": "기존 UI (하단 고정 버튼 없음)", "traffic_allocation": 50}, {"name": "Variant A", "description": "플로팅 장바구니 버튼 추가", "traffic_allocation": 50}]',
        5.0,
        95.0,
        80.0,
        '상품 상세 페이지, 모바일 사용자 우선',
        NULL,
        NULL,
        NULL
    ),
    (
        '신규 가입 쿠폰 (20% 할인)',
        '신규 가입 고객 대상 24시간 한정 20% 할인 쿠폰 제공을 통한 첫 구매 전환율 개선 실험',
        '키다',
        'Data Team',
        'Marketing Campaign',
        'complete',
        '첫 구매 전환',
        '신규 가입 직후 할인 쿠폰을 제공하면 구매 장벽이 낮아져 첫 구매 전환율이 향상될 것이다',
        8,
        7,
        9,
        7,
        '["8", "9"]',
        '2024-10-01',
        '2024-11-30',
        2,
        '[{"name": "Control", "description": "쿠폰 미제공 (전년도 기준)", "traffic_allocation": 0}, {"name": "Treatment", "description": "20% 할인 쿠폰, 24시간 유효", "traffic_allocation": 100}]',
        10.0,
        95.0,
        89.0,
        '신규 가입 후 자동 발급, 20% 할인, 24시간 유효',
        '10월 중순 경쟁사 프로모션, 11월 블랙프라이데이 효과',
        NULL,
        NULL
    );

