import { useState } from 'react';
import { Send, Phone, User } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

const contacts: Contact[] = [
  { id: '1', name: 'Dr. Smith', role: 'Attending Physician', online: true },
  { id: '2', name: 'Dr. Johnson', role: 'Cardiologist', online: true },
  { id: '3', name: 'Nurse Rodriguez', role: 'Floor Nurse', online: false },
  { id: '4', name: 'Pharm. Lee', role: 'Pharmacist', online: true },
  { id: '5', name: 'Dr. Williams', role: 'Neurologist', online: false },
];

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      text: 'Patient John Brown needs clarification on Amoxicillin dosage. Can you confirm 500mg TID?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isOwn: false,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Yes, confirmed. 500mg three times daily with meals.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isOwn: true,
    },
  ]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedContact) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        senderId: 'me',
        text: messageText,
        timestamp: new Date(),
        isOwn: true,
      },
    ]);
    setMessageText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto">
        {/* Contacts List */}
        <Card className="glass-card md:w-80 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contacts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left',
                    selectedContact?.id === contact.id && 'bg-secondary'
                  )}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                        contact.online ? 'bg-success' : 'bg-muted-foreground'
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="glass-card flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedContact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{selectedContact.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {selectedContact.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.isOwn ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2',
                        message.isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-secondary-foreground rounded-bl-md'
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} className="gradient-primary text-primary-foreground">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a contact to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
