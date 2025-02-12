CREATE TABLE "auth_session" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"session" varchar(2048) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_state" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"state" varchar(1024) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"created_at" varchar(30) NOT NULL,
	"indexed_at" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"uri" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"image_url" text NOT NULL,
	"caption" text,
	"created_at" varchar(30) NOT NULL,
	"updated_at" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"did" varchar(255) PRIMARY KEY NOT NULL,
	"handle" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"avatar_link" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "users_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("did") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_uri_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("uri") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("did") ON DELETE no action ON UPDATE no action;