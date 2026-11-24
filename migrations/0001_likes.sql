-- 匿名点赞：同一 anon_id 对同一项目只计一次
CREATE TABLE likes (
  project_id TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (project_id, anon_id)
);

-- 写操作流水，用于按 IP 限流；只存加盐哈希，超过 1 小时的记录在写入时清理
CREATE TABLE like_events (
  ip_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_like_events_ip_time ON like_events (ip_hash, created_at);
CREATE INDEX idx_like_events_time ON like_events (created_at);
