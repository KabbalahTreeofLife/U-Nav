-- RLS Policies for U-Nav Database

-- Universities: Everyone can read
CREATE POLICY "allow_read_universities" ON public.universities FOR SELECT USING (true);

-- Users: Everyone can read, insert, update, delete (for now - can be restricted later)
CREATE POLICY "allow_read_users" ON public.users FOR SELECT USING (true);
CREATE POLICY "allow_insert_users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "allow_delete_users" ON public.users FOR DELETE USING (true);

-- Dining locations: Everyone can read, insert, update, delete
CREATE POLICY "allow_read_dining" ON public.dining_locations FOR SELECT USING (true);
CREATE POLICY "allow_insert_dining" ON public.dining_locations FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_dining" ON public.dining_locations FOR UPDATE USING (true);
CREATE POLICY "allow_delete_dining" ON public.dining_locations FOR DELETE USING (true);

-- Events: Everyone can read, insert, update, delete
CREATE POLICY "allow_read_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "allow_insert_events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "allow_delete_events" ON public.events FOR DELETE USING (true);

-- Password reset tokens: Everyone can read, insert, delete (for password reset functionality)
CREATE POLICY "allow_read_tokens" ON public.password_reset_tokens FOR SELECT USING (true);
CREATE POLICY "allow_insert_tokens" ON public.password_reset_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_delete_tokens" ON public.password_reset_tokens FOR DELETE USING (true);

SELECT 'All RLS policies created' as status;