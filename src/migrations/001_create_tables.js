exports.up = function(knex) {
    return knex.schema
      .createTable('users', function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password_hash', 255).notNullable();
        table.text('bio');
        table.string('avatar', 500);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('posts', function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.text('content').notNullable();
        table.uuid('author_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('likes').defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTable('posts')
      .dropTable('users');
  };