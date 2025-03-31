<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteGroupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Group $group)
    {
        //
    }

    public function handle(): void
    {
        $id = $this->group->id;
        $name = $this->group->name;

        try {
            DB::transaction(function () {
                // First clear last_message_id references in conversations
                DB::table('conversations')
                    ->whereIn('last_message_id', $this->group->messages->pluck('id'))
                    ->update(['last_message_id' => null]);

                // Then clear group's last_message_id
                $this->group->last_message_id = null;
                $this->group->save();

                // Now safe to delete messages
                $this->group->messages->each->delete();

                // Remove all users from the group
                $this->group->users()->detach();

                // Finally delete the group
                $this->group->delete();
            });

            GroupDeleted::dispatch($id, $name);
        } catch (\Exception $e) {
            Log::error('Group deletion error:', [
                'group_id' => $id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
