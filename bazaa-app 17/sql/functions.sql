-- Bunu da SQL Editor-də schema.sql-dan sonra çalışdır

create or replace function decrement_stock(p_id uuid, qty int)
returns void as $$
begin
  update products
  set stock = greatest(0, stock - qty),
      updated_at = now()
  where id = p_id;
end;
$$ language plpgsql;
