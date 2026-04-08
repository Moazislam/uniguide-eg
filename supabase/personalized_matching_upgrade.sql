alter table universities
  add column if not exists governorate text,
  add column if not exists metro_area text;

alter table student_profiles
  add column if not exists home_governorate text,
  add column if not exists preferred_locations text[],
  add column if not exists mobility_preference text check (mobility_preference in ('same_city','nearby','anywhere')),
  add column if not exists preferred_university_types text[],
  add column if not exists preferred_systems text[];

update universities
set
  governorate = case slug
    when 'cairo-university' then 'Giza'
    when 'ain-shams-university' then 'Cairo'
    when 'alexandria-university' then 'Alexandria'
    when 'guc' then 'Cairo'
    when 'auc' then 'Cairo'
    when 'msa-university' then 'Cairo'
    when 'nile-university' then 'Giza'
    else governorate
  end,
  metro_area = case slug
    when 'alexandria-university' then 'alexandria'
    else 'greater-cairo'
  end
where slug in (
  'cairo-university',
  'ain-shams-university',
  'alexandria-university',
  'guc',
  'auc',
  'msa-university',
  'nile-university'
);

create index if not exists universities_governorate_idx on universities (governorate);
create index if not exists universities_metro_area_idx on universities (metro_area);
