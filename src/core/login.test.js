const { validarLogin } = require("./login");

describe('Pruebas con el login', () => {
    test('Se ingresan datos no válidos', () => {
        expect(validarLogin('admin12', 'hotel12').valido).toBe(false);
    })

    test('Se ingresan datos válidos', () => {
        expect(validarLogin('admin', 'hotel').valido).toBe(true);
    })
})
