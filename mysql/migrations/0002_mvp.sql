SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id VARCHAR(255) NOT NULL,
  type VARCHAR(128) NOT NULL,
  stripe_session_id VARCHAR(255) NULL,
  stripe_payment_intent_id VARCHAR(255) NULL,
  order_id CHAR(36) NULL,
  processed_ok TINYINT(1) NOT NULL DEFAULT 1,
  error TEXT NULL,
  raw JSON NULL,
  processed_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (event_id),
  KEY stripe_webhook_events_order_id_idx (order_id),
  CONSTRAINT stripe_webhook_events_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  order_id CHAR(36) NOT NULL,
  provider VARCHAR(32) NOT NULL DEFAULT 'stripe',
  status VARCHAR(32) NOT NULL DEFAULT 'succeeded',
  amount INT NOT NULL,
  currency CHAR(3) NOT NULL,
  stripe_session_id VARCHAR(255) NULL,
  stripe_payment_intent_id VARCHAR(255) NULL,
  stripe_event_id VARCHAR(255) NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY payments_user_id_idx (user_id),
  KEY payments_order_id_idx (order_id),
  UNIQUE KEY payments_stripe_event_uq (stripe_event_id),
  UNIQUE KEY payments_stripe_pi_uq (stripe_payment_intent_id),
  CONSTRAINT payments_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT payments_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS entitlements (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  kind VARCHAR(64) NOT NULL,
  order_id CHAR(36) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  active_kind VARCHAR(64) GENERATED ALWAYS AS (CASE WHEN active = 1 THEN kind ELSE NULL END) STORED,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY entitlements_user_id_idx (user_id),
  UNIQUE KEY entitlements_one_active_kind_uq (user_id, active_kind),
  CONSTRAINT entitlements_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT entitlements_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS important_dates (
  id CHAR(36) NOT NULL,
  title_zh VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  date TIMESTAMP(3) NOT NULL,
  timezone VARCHAR(32) NOT NULL DEFAULT 'AOE',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY important_dates_sort_idx (sort_order),
  KEY important_dates_date_idx (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS news (
  id CHAR(36) NOT NULL,
  title_zh VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  body_zh MEDIUMTEXT NOT NULL,
  body_en MEDIUMTEXT NOT NULL,
  published_at TIMESTAMP(3) NULL,
  pinned TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY news_published_at_idx (published_at),
  KEY news_pinned_idx (pinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sponsors (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  level VARCHAR(64) NOT NULL DEFAULT 'partner',
  logo_url VARCHAR(1024) NULL,
  website_url VARCHAR(1024) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY sponsors_sort_idx (sort_order),
  KEY sponsors_level_idx (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
