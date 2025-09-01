import { createContext, useContext } from "react";


// 1. Context'i burada oluşturuyoruz. Başlangıç değeri olarak null verelim.
export const AuthContext = createContext(null);

// 2. Bu context'i kolayca kullanmamızı sağlayan hook'u da burada tanımlıyoruz.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

