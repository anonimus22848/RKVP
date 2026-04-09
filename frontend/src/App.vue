<template>
  <div>
    <nav>
      <router-link to="/profile">Профиль</router-link> |
      <router-link to="/auth/login">Вход</router-link> |
      <router-link to="/auth/register">Регистрация</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
nav {
  text-align: center;
  margin: 20px;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}
</style>