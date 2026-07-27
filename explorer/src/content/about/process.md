NYCRO hosts a database of all their Quarter session court records. We extract a subset of these

1. Search the archive’s online catalogue for every  record matching “Whitby” and use this to constuct a list of target records to retrieve.
2. Download and cache a local copy of each matching record.
3. Filter to select only the Summary Conviction records (for the purposes of the present project).
4. Send the text from the record to a large language model, with instructions to extract structured details — offender names, offence, dates, location, sentencing. This step was problematic and needed to be run in multiole passes to achieve quality.
5. Load the extracted data into a database.
6. Manually sanity check, deduplicate and categorise the data.

The taxonomies used were ad-hoc a weakeness which a second version shoild address. Locations needed to be categorised hierarchically in a way which was not anachronistic, but which also allows a modern user familiar with the area to investigate. This is an unsatisfiable problem with diverging requirements, but our rule of thumb has been to allocate areas to parishes as they stood in 1880 at the end of our coversge period. There remains significant potentisl for confusion between Whitby and Ruswarp - for much of the century a single parish, but now two separate towns, and Whitby and Hawsker which in the C19th seems to have included e.g. the Abbey headland and Green Lane.

Similar problems were encountered organising occupations. Are pedlars and hawkers two trades or the same? There are many such fine distinctions. Here we have attempted to strike a balance between the usefulness of aggregation and of disaggregation.

This os even more the case for the taxonomy of offences. We have loosely based our categoristaion on INSERT BOOK, but with many adjusments in the hope of more intuitive prganisation for a modern nonsepcialost.