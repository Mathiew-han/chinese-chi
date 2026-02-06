SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  email VARCHAR(320) NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY users_email_uq (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) NOT NULL,
  email VARCHAR(320) NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT profiles_role_chk CHECK (role IN ('user', 'admin')),
  CONSTRAINT profiles_user_fk FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  abstract TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY submissions_user_id_idx (user_id),
  KEY submissions_created_at_idx (created_at),
  CONSTRAINT submissions_status_chk CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'camera_ready')),
  CONSTRAINT submissions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submission_files (
  id CHAR(36) NOT NULL,
  submission_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  kind VARCHAR(32) NOT NULL DEFAULT 'paper',
  path VARCHAR(1024) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY submission_files_submission_id_idx (submission_id),
  KEY submission_files_user_id_idx (user_id),
  CONSTRAINT submission_files_kind_chk CHECK (kind IN ('paper', 'supplement')),
  CONSTRAINT submission_files_submission_fk FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  CONSTRAINT submission_files_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  kind VARCHAR(64) NOT NULL,
  amount INT NOT NULL,
  currency CHAR(3) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'created',
  stripe_session_id VARCHAR(255) NULL,
  stripe_payment_intent_id VARCHAR(255) NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY orders_user_id_idx (user_id),
  KEY orders_created_at_idx (created_at),
  UNIQUE KEY orders_stripe_session_uq (stripe_session_id),
  UNIQUE KEY orders_stripe_payment_intent_uq (stripe_payment_intent_id),
  CONSTRAINT orders_status_chk CHECK (status IN ('created', 'pending', 'paid', 'failed', 'canceled')),
  CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id CHAR(36) NOT NULL,
  actor_id CHAR(36) NULL,
  action VARCHAR(128) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id CHAR(36) NULL,
  meta JSON NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY audit_logs_actor_id_idx (actor_id),
  KEY audit_logs_created_at_idx (created_at),
  CONSTRAINT audit_logs_actor_fk FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
