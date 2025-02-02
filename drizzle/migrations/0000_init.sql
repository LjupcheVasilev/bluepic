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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"did" varchar(255) NOT NULL,
	"handle" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"avatar" text,
	"bio" text,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_did_unique" UNIQUE("did"),
	CONSTRAINT "users_handle_unique" UNIQUE("handle")
);
