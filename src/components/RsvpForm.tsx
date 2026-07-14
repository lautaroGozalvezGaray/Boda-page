import { useState, type FormEvent } from 'react';
import { buildWhatsappUrl } from '@/utils/links';
import { buildRsvpMessage } from '@/utils/rsvpMessage';

interface RsvpFormProps {
  phoneNumber: string;
  partnerOne: string;
  partnerTwo: string;
  referenceCode: string;
}

interface FormErrors {
  responsible?: string;
  attendees?: string;
}

export default function RsvpForm({
  phoneNumber,
  partnerOne,
  partnerTwo,
  referenceCode,
}: RsvpFormProps) {
  const [responsible, setResponsible] = useState('');
  const [attendees, setAttendees] = useState<string[]>(['']);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState(false);

  function handleAttendeeChange(index: number, value: string): void {
    setAttendees((current) => current.map((name, i) => (i === index ? value : name)));
  }

  function handleAddAttendee(): void {
    setAttendees((current) => [...current, '']);
  }

  function handleRemoveAttendee(index: number): void {
    setAttendees((current) => current.filter((_, i) => i !== index));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!responsible.trim()) {
      nextErrors.responsible = 'Ingresá el nombre y apellido del responsable de la reserva.';
    }

    const validAttendees = attendees.map((name) => name.trim()).filter(Boolean);
    if (validAttendees.length < 1) {
      nextErrors.attendees = 'Agregá al menos un asistente.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSuccessMessage(false);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const validAttendees = attendees.map((name) => name.trim()).filter(Boolean);

    const message = buildRsvpMessage({
      partnerOne,
      partnerTwo,
      responsible: responsible.trim(),
      attendees: validAttendees,
      dietaryRestrictions,
      referenceCode,
    });

    const whatsappUrl = buildWhatsappUrl(phoneNumber, message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSuccessMessage(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface flex w-full max-w-xl flex-col gap-6 p-6 text-left sm:p-8"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="rsvp-responsible" className="section-eyebrow">
          Responsable de la reserva
        </label>
        <input
          id="rsvp-responsible"
          type="text"
          value={responsible}
          onChange={(event) => setResponsible(event.target.value)}
          placeholder="Nombre y apellido"
          className="min-h-12 rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-ink-800 shadow-sm outline-none transition-all focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
          aria-invalid={Boolean(errors.responsible)}
          aria-describedby={errors.responsible ? 'rsvp-responsible-error' : undefined}
        />
        {errors.responsible && (
          <p id="rsvp-responsible-error" role="alert" className="text-sm text-blush-700">
            {errors.responsible}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="section-eyebrow">Asistentes</span>

        <div className="flex flex-col gap-3">
          {attendees.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <label htmlFor={`rsvp-attendee-${index}`} className="sr-only">
                Persona {index + 1}
              </label>
              <input
                id={`rsvp-attendee-${index}`}
                type="text"
                value={name}
                onChange={(event) => handleAttendeeChange(index, event.target.value)}
                placeholder={`Persona ${index + 1}`}
                className="min-h-12 flex-1 rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-ink-800 shadow-sm outline-none transition-all focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
              />
              {attendees.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAttendee(index)}
                  aria-label={`Quitar persona ${index + 1}`}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-sand-100 hover:text-blush-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.attendees && (
          <p role="alert" className="text-sm text-blush-700">
            {errors.attendees}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddAttendee}
          className="btn-ghost w-fit px-4 py-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar otra persona
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="rsvp-dietary" className="section-eyebrow">
          Restricciones alimentarias <span className="font-sans text-ink-400">(opcional)</span>
        </label>
        <textarea
          id="rsvp-dietary"
          value={dietaryRestrictions}
          onChange={(event) => setDietaryRestrictions(event.target.value)}
          placeholder="Ej: vegetariano, celíaco, alergias..."
          rows={2}
          className="min-h-[5.5rem] rounded-xl border border-sand-200 bg-white px-4 py-3 text-ink-800 shadow-sm outline-none transition-all focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
        />
      </div>

      <button
        type="submit"
        className="btn-primary px-8 py-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.4zM12 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.5.9.9-3.4-.2-.4c-1.1-1.7-1.6-3.6-1.6-5.6C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9.8-10 9.8zm5.4-7.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4-.1-.6-.1-.2-.6-1.5-.9-2-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.2.2 1.7 2.6 4.1 3.5 2.4.9 2.4.6 2.8.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1z" />
        </svg>
        Confirmar por WhatsApp
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`text-center text-sm text-blush-700 transition-opacity duration-500 ${
          successMessage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Se abrió WhatsApp con tu mensaje. ¡Gracias por confirmar!
      </p>
    </form>
  );
}
