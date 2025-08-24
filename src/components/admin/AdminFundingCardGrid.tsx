import React from 'react';

interface AdminFundingCardGridProps {
  cards: any[];
  onEdit: (card: any) => void;
  onDelete: (id: string) => void;
  category: string;
}

const fieldLabels: Record<string, string[]> = {
  angels: ['Name', 'LinkedIn', 'City', 'Invests In'],
  vcs: ['Name', 'Website', 'HQ', 'Fund Size'],
  microvcs: ['Name', 'Website', 'HQ', 'Fund Size'],
  incubators: ['Name', 'Website', 'City', 'Focus'],
  accelerators: ['Name', 'Website', 'City', 'Focus'],
  grants: ['Name', 'Website', 'Country', 'Type'],
};

const AdminFundingCardGrid: React.FC<AdminFundingCardGridProps> = ({ cards, onEdit, onDelete, category }) => {
  const labels = fieldLabels[category] || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 py-8">No cards in this category.</div>
      ) : (
        cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border">
            {labels.map((label) => (
              <div key={label} className="text-sm">
                <span className="font-semibold text-gray-700">{label}: </span>
                <span className="text-gray-800">{card[label.toLowerCase().replace(/ /g, '_')] || '-'}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
                onClick={() => onEdit(card)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                onClick={() => onDelete(card.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminFundingCardGrid; 