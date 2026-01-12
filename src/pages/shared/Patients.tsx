import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, AlertTriangle, Pill, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { patients } from '@/lib/mockData';

export default function Patients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.room.includes(searchQuery)
  );

  return (
    <AppLayout>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">
            {patients.length} patients in your care
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="glass-card hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                if (user?.role === 'doctor') {
                  navigate(`/order?patientId=${patient.id}`);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        {patient.allergies.length > 0 && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Room {patient.room}</span>
                        <span>•</span>
                        <span>Bed {patient.bedNumber}</span>
                      </div>
                      {patient.allergies.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {patient.allergies.map((allergy) => (
                            <Badge
                              key={allergy}
                              variant="destructive"
                              className="text-xs"
                            >
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user?.role === 'doctor' && (
                      <Button size="sm" variant="outline" className="hidden sm:flex">
                        <Pill className="h-4 w-4 mr-2" />
                        Order Meds
                      </Button>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPatients.length === 0 && (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No patients found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
