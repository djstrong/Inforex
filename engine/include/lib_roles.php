<?php

/**
 * Sprawdza, czy aktualnie zalogowany użytkownik posiada wskazaną rolę.
 * @param $role - nazwa roli,
 * @return true - jeżeli użytkownik posiada rolę
 */
function hasRole($role){
	global $user;
	return isset($user['role'][$role]);
}

/**
 * Sprawdza, czy aktualnie zalogowany użytkownik posiada wskazany poziom dostepu do bieżącego korpusu.
 * @param $role - nazwa roli,
 * @return true - jeżeli użytkownik posiada rolę
 */
function hasCorpusRole($role){
	global $corpus, $user;
	return isset($corpus['role'][$user['user_id']][$role]);
}

?>