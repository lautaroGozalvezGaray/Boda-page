import { useRef, useState, type FormEvent } from 'react';
import { buildWhatsappUrl } from '@/utils/links';
import { buildRsvpMessage } from '@/utils/rsvpMessage';

interface RsvpFormProps {
  phoneNumber: string;
  partnerOne: string;
  partnerTwo: string;
  referenceCode: string;
  showTransferNotice?: boolean;
}

interface Attendee {
  id: number;
  name: string;
  isEntering: boolean;
  isRemoving: boolean;
}

type AttendeeErrors = Record<number, string>;

const attendeeErrorMessage = 'Ingresá el nombre y apellido de esta persona.';

export default function RsvpForm({
  phoneNumber,
  partnerOne,
  partnerTwo,
  referenceCode,
  showTransferNotice = false,
}: RsvpFormProps) {
  const nextAttendeeId = useRef(1);
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 0, name: '', isEntering: false, isRemoving: false },
  ]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [attendeeErrors, setAttendeeErrors] = useState<AttendeeErrors>({});
  const [successMessage, setSuccessMessage] = useState(false);

  const activeAttendeeCount = attendees.filter((attendee) => !attendee.isRemoving).length;

  function handleAttendeeChange(id: number, value: string): void {
    setAttendees((current) =>
      current.map((attendee) => (attendee.id === id ? { ...attendee, name: value } : attendee)),
    );
    setAttendeeErrors((current) => {
      if (!current[id]) return current;

      const remainingErrors = { ...current };
      delete remainingErrors[id];
      return remainingErrors;
    });
  }

  function handleAddAttendee(): void {
    const id = nextAttendeeId.current;
    nextAttendeeId.current += 1;

    setAttendees((current) => [...current, { id, name: '', isEntering: true, isRemoving: false }]);
    window.requestAnimationFrame(() => {
      setAttendees((current) =>
        current.map((attendee) => (attendee.id === id ? { ...attendee, isEntering: false } : attendee)),
      );
    });
  }

  function handleRemoveAttendee(id: number): void {
    setAttendees((current) => {
      const activeCount = current.filter((attendee) => !attendee.isRemoving).length;
      if (activeCount <= 1) return current;

      return current.map((attendee) =>
        attendee.id === id ? { ...attendee, isRemoving: true } : attendee,
      );
    });
    setAttendeeErrors((current) => {
      const remainingErrors = { ...current };
      delete remainingErrors[id];
      return remainingErrors;
    });
    window.setTimeout(() => {
      setAttendees((current) => current.filter((attendee) => attendee.id !== id));
    }, 200);
  }

  function validate(): AttendeeErrors {
    return attendees.reduce<AttendeeErrors>((errors, attendee) => {
      if (!attendee.isRemoving && !attendee.name.trim()) {
        errors[attendee.id] = attendeeErrorMessage;
      }

      return errors;
    }, {});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSuccessMessage(false);

    const nextErrors = validate();
    setAttendeeErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const confirmedAttendees = attendees
      .filter((attendee) => !attendee.isRemoving)
      .map((attendee) => attendee.name.trim());
    const message = buildRsvpMessage({
      partnerOne,
      partnerTwo,
      attendees: confirmedAttendees,
      dietaryRestrictions,
      referenceCode,
    });

    window.open(buildWhatsappUrl(phoneNumber, message), '_blank', 'noopener,noreferrer');
    setSuccessMessage(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface flex w-full max-w-xl flex-col gap-8 p-6 text-left sm:p-8"
      noValidate
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="section-eyebrow mb-2">¿Quiénes asistirán?</legend>

        <div className="flex flex-col gap-3">
          {attendees.map((attendee, index) => {
            const error = attendeeErrors[attendee.id];
            const isOnlyActiveAttendee = activeAttendeeCount === 1 && !attendee.isRemoving;

            return (
              <div
                key={attendee.id}
                className={`grid overflow-hidden transition-all duration-200 ease-out ${
                  attendee.isEntering || attendee.isRemoving
                    ? 'grid-rows-[0fr] translate-y-1 opacity-0'
                    : 'grid-rows-[1fr] opacity-100'
                }`}
              >
                <div className="min-h-0">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-1 flex-col gap-2">
                      <label htmlFor={`rsvp-attendee-${attendee.id}`} className="sr-only">
                        Nombre y apellido de la persona {index + 1}
                      </label>
                      <input
                        id={`rsvp-attendee-${attendee.id}`}
                        type="text"
                        value={attendee.name}
                        onChange={(event) => handleAttendeeChange(attendee.id, event.target.value)}
                        placeholder="Nombre y apellido"
                        className="min-h-14 w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-base text-ink-800 shadow-sm outline-none transition-all focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `rsvp-attendee-${attendee.id}-error` : undefined}
                        disabled={attendee.isRemoving}
                      />
                      {error && (
                        <p id={`rsvp-attendee-${attendee.id}-error`} role="alert" className="text-sm text-blush-700">
                          {error}
                        </p>
                      )}
                    </div>
                    {!isOnlyActiveAttendee && !attendee.isRemoving && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(attendee.id)}
                        aria-label={`Quitar a la persona ${index + 1}`}
                        className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-sand-100 hover:text-blush-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
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
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={handleAddAttendee} className="btn-ghost w-fit px-4 py-2.5">
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
      </fieldset>

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

      <button type="submit" className="btn-primary px-8 py-3">
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

      {successMessage && (
        <p role="status" aria-live="polite" className="text-center text-sm leading-relaxed text-blush-700">
          Se abrió WhatsApp con tu mensaje. ¡Gracias por confirmar!
          {showTransferNotice && (
            <>
              {' '}
              Una vez enviada la confirmación, podés realizar la transferencia utilizando los datos
              que figuran a continuación.
            </>
          )}
        </p>
      )}
    </form>
  );
}
