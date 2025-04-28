import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading de componentes del módulo
const ListFacturas = lazy(() => import('../../pages/Facturas/ListFacturas'));
const FacturaForm = lazy(() => import('../../pages/Facturas/FacturaForm'));
const FacturaDetail = lazy(() => import('../../pages/Facturas/FacturaDetail'));

const FacturaRoutes = () => {
  return (
    <Routes>
      <Route index element={<ListFacturas />} />
      <Route path="nueva" element={<FacturaForm />} />
      <Route path=":id" element={<FacturaDetail />} />
      <Route path="editar/:id" element={<FacturaForm />} />
    </Routes>
  );
};

export default FacturaRoutes;