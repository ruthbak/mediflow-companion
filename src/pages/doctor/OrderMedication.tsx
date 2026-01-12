import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { patients, medications } from '@/lib/mockData';

const frequencies = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed (PRN)',
  'Before meals',
  'After meals',
];

export default function OrderMedication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [selectedPatient, setSelectedPatient] = useState(patientId || '');
  const [medicationSearch, setMedicationSearch] = useState('');
  const [selectedMedication, setSelectedMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [route, setRoute] = useState('');

  const patient = patients.find((p) => p.id === selectedPatient);
  const medication = medications.find((m) => m.id === selectedMedication);

  const filteredMedications = useMemo(() => {
    if (!medicationSearch) return [];
    return medications.filter(
      (m) =>
        m.name.toLowerCase().includes(medicationSearch.toLowerCase()) ||
        m.genericName.toLowerCase().includes(medicationSearch.toLowerCase()) ||
        m.brandNames.some((b) => b.toLowerCase().includes(medicationSearch.toLowerCase()))
    );
  }, [medicationSearch]);

  const hasAllergyConflict = useMemo(() => {
    if (!patient || !medication) return false;
    const allergies = patient.allergies.map((a) => a.toLowerCase());
    return (
      allergies.includes(medication.name.toLowerCase()) ||
      allergies.includes(medication.genericName.toLowerCase()) ||
      medication.category.toLowerCase().includes('antibiotic') &&
        allergies.includes('penicillin') &&
        (medication.name.includes('Amox') || medication.name.includes('Ampicillin'))
    );
  }, [patient, medication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAllergyConflict) {
      toast({
        title: 'Cannot Order Medication',
        description: 'This medication conflicts with patient allergies.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Order Sent Successfully',
      description: `${medication?.name} ${dosage} ordered for ${patient?.name}`,
    });

    navigate('/dashboard');
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Order Medication</h1>
            <p className="text-sm text-muted-foreground">Create a new medication order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - Room {p.room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {patient && patient.allergies.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-medium text-destructive text-sm">Drug Allergies</p>
                    <div className="flex gap-1 mt-1">
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Selection */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Medication Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Medication Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for medication..."
                    value={medicationSearch}
                    onChange={(e) => {
                      setMedicationSearch(e.target.value);
                      setSelectedMedication('');
                    }}
                    className="pl-10"
                  />
                </div>

                {filteredMedications.length > 0 && !selectedMedication && (
                  <div className="mt-2 border rounded-lg divide-y bg-card max-h-48 overflow-y-auto">
                    {filteredMedications.map((med) => (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => {
                          setSelectedMedication(med.id);
                          setMedicationSearch(med.name);
                          setDosage('');
                          setRoute('');
                        }}
                        className="w-full text-left p-3 hover:bg-secondary transition-colors"
                      >
                        <p className="font-medium text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {med.genericName} • {med.brandNames.join(', ')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {selectedMedication && medication && (
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{medication.name} selected</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {medication.category}
                    </Badge>
                  </div>
                )}

                {hasAllergyConflict && (
                  <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                    <p className="text-destructive font-medium text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Allergy conflict detected! Cannot order this medication.
                    </p>
                  </div>
                )}
              </div>

              {medication && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Select value={dosage} onValueChange={setDosage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dosage" />
                        </SelectTrigger>
                        <SelectContent>
                          {medication.commonDosages.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Route</Label>
                      <Select value={route} onValueChange={setRoute}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          {medication.routes.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
            disabled={
              !selectedPatient ||
              !selectedMedication ||
              !dosage ||
              !frequency ||
              !route ||
              hasAllergyConflict
            }
          >
            Order Medication
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
