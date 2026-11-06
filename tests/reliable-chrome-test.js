const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../config/webdriver-simple-config');

(async function loginTest() {
  const driver = await getDriver();

  try {
    // Abrir la página
    await driver.get('https://www.saucedemo.com/');

    // Esperar a que el input de usuario esté visible
    const usernameInput = await driver.wait(
      until.elementLocated(By.id('user-name')),
      10000
    );

    // Ingresar credenciales
    await usernameInput.sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');

    // Click en Login
    await driver.findElement(By.id('login-button')).click();

    // Validar login exitoso esperando redirección
    await driver.wait(
      until.urlContains('inventory.html'),
      10000
    );

    console.log('✅ Login exitoso - prueba pasada');
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
})();
