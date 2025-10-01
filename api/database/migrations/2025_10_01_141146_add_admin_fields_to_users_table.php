<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nama_depan')->nullable()->after('name');
            $table->string('nama_belakang')->nullable()->after('nama_depan');
            $table->date('tanggal_lahir')->nullable()->after('email');
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('tanggal_lahir');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nama_depan', 'nama_belakang', 'tanggal_lahir', 'jenis_kelamin']);
        });
    }
};
