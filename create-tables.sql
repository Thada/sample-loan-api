CREATE TABLE loans
(
    id SERIAL PRIMARY KEY,
    loan_id varchar(16),
    amount float,
    interest_rate float,
    months int,
    payment float,
    CONSTRAINT loan_id_unique UNIQUE (loan_id)
);