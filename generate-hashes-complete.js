const bcrypt = require('bcryptjs');

async function main() {
  console.log("Iniciando generación de hashes...\n");
  
  try {
    const usuarios = [
      { id: 1, nombre: 'Jossue', contraseña: '$2b$10$B7fo33L3EZs51y11wGOU8ObtFG8kMedDEMEfLnpesCiH2/M7esr4a' },
      { id: 2, nombre: 'Elizabeth', contraseña: '$2b$10$B1sSN8hYKZ2dn/dDjY.XUel2Q6h2IPoiCkKlGD0nsjYboM2KB51cS' },
      { id: 3, nombre: 'Jonhy', contraseña: '$2b$10$R.1jQpu0DVdwCAgxVhvc1.VVY9PtjsTvA6MvmzdqULgGArILa8ZkO' },
      { id: 4, nombre: 'Jenifer', contraseña: 'diaz123' },
      { id: 5, nombre: 'Jerico', contraseña: 'castroj234' },
      { id: 6, nombre: 'Keren', contraseña: 'kerenj345' },
      { id: 7, nombre: 'Erika', contraseña: 'jeri456' },
      { id: 8, nombre: 'Carmen', contraseña: 'carmen567' },
      { id: 9, nombre: 'Yolanda', contraseña: 'yoli678' },
      { id: 10, nombre: 'Amanda', contraseña: 'amanda789' },
      { id: 11, nombre: 'Teresa', contraseña: 'teresa891' },
      { id: 12, nombre: 'Alison', contraseña: 'aliss912' },
      { id: 13, nombre: 'Danae', contraseña: 'danae923' },
      { id: 14, nombre: 'Eva', contraseña: 'eva934' },
      { id: 15, nombre: 'Melissa', contraseña: 'melissa' },
      { id: 16, nombre: 'Leslie', contraseña: 'leslie9456' },
      { id: 17, nombre: 'Ivanya', contraseña: 'ivana967' },
      { id: 18, nombre: 'Brenda', contraseña: 'brenda978' },
      { id: 19, nombre: 'Julia', contraseña: 'julia989' },
      { id: 20, nombre: 'Flory', contraseña: 'flory812' },
      { id: 21, nombre: 'Scarlet', contraseña: 'scarlet823' },
      { id: 22, nombre: 'Amelia', contraseña: 'amelia834' }
    ];

    console.log("-- COMANDOS SQL PARA ACTUALIZAR --\n");
    
    for (const user of usuarios) {
      if (!user.contraseña.startsWith('$2b$')) {
        const hash = await bcrypt.hash(user.contraseña, 10);
        console.log(`UPDATE usuario SET contraseña = '${hash}' WHERE id = ${user.id};`);
      }
    }

    console.log("\n¡Proceso completado! Copia los comandos UPDATE y ejecútalos en MySQL.");

  } catch (error) {
    console.error("\nERROR:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));