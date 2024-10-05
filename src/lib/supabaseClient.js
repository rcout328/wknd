import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gbygtbvlztfukcbzhtgf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieWd0YnZsenRmdWtjYnpodGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNTM1NDQsImV4cCI6MjA0MzcyOTU0NH0.ioyh1iPQMRD1O7_wSExahZ4yKp1yyTDILI7LNZMCI5A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);