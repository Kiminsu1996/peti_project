SELECT
	concat(
        first_alphabet.alphabet, 
        second_alphabet.alphabet, 
        third_alphabet.alphabet,
        forth_alphabet.alphabet
    ) AS "engName"
FROM
	peti_type
JOIN
	alphabet first_alphabet
ON
	first_alphabet.idx = peti_type.first
JOIN
	alphabet second_alphabet
ON
	second_alphabet.idx = peti_type.second
JOIN
	alphabet third_alphabet
ON
	third_alphabet = peti_type.third
JOIN
	alphabet forth_alphabet
ON
	forth_alphabet.idx = peti_type.forth

SELECT  
    eng_name AS "engName"
FROM
    pet_type