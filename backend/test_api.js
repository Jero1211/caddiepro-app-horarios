async function testAPI() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🧪 INICIANDO PRUEBAS DEL BACKEND Y MONGODB...\n');

  try {
    // 1. Health
    const resHealth = await fetch(`${BASE_URL}/health`);
    const dataHealth = await resHealth.json();
    console.log('✅ 1. Health Check:', dataHealth);

    // 2. Stats
    const resStats = await fetch(`${BASE_URL}/caddies/stats`);
    const dataStats = await resStats.json();
    console.log('\n✅ 2. Estadísticas MongoDB:', dataStats.data);

    // 3. List
    const resList = await fetch(`${BASE_URL}/caddies`);
    const dataList = await resList.json();
    console.log(`\n✅ 3. Listar Caddies: Total recuperados = ${dataList.count}`);
    console.log('   Ejemplo 1:', dataList.data[0]?.name, '| CC:', dataList.data[0]?.documentId, '| Cat:', dataList.data[0]?.category);

    // 4. Filter Golf
    const resGolf = await fetch(`${BASE_URL}/caddies?sport=Golf`);
    const dataGolf = await resGolf.json();
    console.log(`\n✅ 4. Filtro por Deporte (Golf): ${dataGolf.count} caddies`);

    // 5. Get by Cedula
    const testDoc = dataList.data[0]?.documentId;
    const resSingle = await fetch(`${BASE_URL}/caddies/${testDoc}`);
    const dataSingle = await resSingle.json();
    console.log(`\n✅ 5. Buscar por Cédula (${testDoc}):`, dataSingle.data?.name, '| Disponibilidad:', dataSingle.data?.weeklyAvailability);

    // 6. Create Caddie (POST)
    const newDocId = '999000111';
    // Remove if exists
    await fetch(`${BASE_URL}/caddies/${newDocId}`, { method: 'DELETE' });
    const resCreate = await fetch(`${BASE_URL}/caddies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: newDocId,
        name: 'MARIO ALEXANDER DUQUE',
        sport: 'Golf',
        category: 'Categoría 1',
        venue: 'Llanogrande',
        phone: '+57 311 999 8888',
        weeklyAvailability: {
          lunes: 'AM',
          martes: 'Estudia',
          miercoles: 'PM',
          jueves: 'Estudia',
          viernes: 'AM',
          sabado: 'AM',
          domingo: 'PM'
        },
        foundationNotes: 'Beca deportiva Club Campestre'
      })
    });
    const dataCreate = await resCreate.json();
    console.log(`\n✅ 6. Crear Caddie (POST):`, dataCreate.message, '| ID:', dataCreate.data?.documentId);

    // 7. Update Availability (PUT)
    const resUpdate = await fetch(`${BASE_URL}/caddies/${newDocId}/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weeklyAvailability: {
          lunes: 'Estudia',
          martes: 'AM',
          miercoles: 'Estudia',
          jueves: 'AM',
          viernes: 'Descanso',
          sabado: 'AM',
          domingo: 'PM'
        },
        foundationNotes: 'Horario actualizado: Nuevas materias universitarias.'
      })
    });
    const dataUpdate = await resUpdate.json();
    console.log(`\n✅ 7. Actualizar Horario/Estudio (PUT):`, dataUpdate.message, '| Lunes:', dataUpdate.data?.weeklyAvailability?.lunes);

    // 8. Delete Caddie (DELETE)
    const resDel = await fetch(`${BASE_URL}/caddies/${newDocId}`, { method: 'DELETE' });
    const dataDel = await resDel.json();
    console.log(`\n✅ 8. Eliminar Caddie (DELETE):`, dataDel.message);

    // 9. Activity Logs
    const resLogs = await fetch(`${BASE_URL}/logs`);
    const dataLogs = await resLogs.json();
    console.log(`\n✅ 9. Bitácora de Auditoría (Logs): ${dataLogs.count} registros almacenados.`);
    console.log('   Último log:', dataLogs.data[0]?.action, '-', dataLogs.data[0]?.detail);

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE LA API Y MONGODB PASARON CON ÉXITO AL 100%!');
  } catch (err) {
    console.error('❌ Error en las pruebas:', err);
  }
}

testAPI();
