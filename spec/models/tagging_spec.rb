require 'rails_helper'

RSpec.describe Tagging, type: :model do
  it { should belong_to(:tag) }
  it { should belong_to(:story) }
end
